const { nanoid } = require('nanoid')

const upload = require('./upload')

module.exports = async (key, Model) => {
  
  // 查询没有上传在七牛中的数据
  const movies = await Model.find({$or: [{[key]: ''}, {[key]: null} ,{[key]: {$exists: false}}]})
  
  for(let i = 0; i < movies.length; i++) {
    let movie = movies[i]

    let resUrl = ''
    let qiniuUrl = ''

    if(key === 'posterKey' && movie.posters) { //海报

      resUrl = movie.posters
      qiniuUrl = `${nanoid(10)}.jpg`

    }else if(key === 'coverKey' && movie.cover) { //视频头图

      resUrl = movie.cover
      qiniuUrl = `${nanoid(10)}.jpg`

    }else if(key === 'videoKey' && movie.link) { //视频

      resUrl = movie.link
      qiniuUrl = `${nanoid(10)}.mp4`
      
    }
    
    if(resUrl && qiniuUrl) {
      // 上传七牛中
      await upload(resUrl, qiniuUrl)

      // 将key存入库中
      movie[key] = qiniuUrl
      await movie.save()
    }

  }
}