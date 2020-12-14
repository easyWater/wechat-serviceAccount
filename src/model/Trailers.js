// 引入mongoose
const mongoose = require('mongoose')
// 获取Schema
const Schema = mongoose.Schema

// 创建约束对象
const trailerSchema = new Schema({
  title: String,
  score: Number,
  duration: String,
  directors: String,
  actors: [String],
  posters: String,
  genres: [String],
  summary: String,
  doubanId: {
    type: Number,
    unique: true
  },
  releaseDate: String,
  cover: String,
  link: String,
  posterKey: String, //海报图片上传到七牛云，返回的key值
  coverKey: String, //视频头图key
  videoKey: String, //视频key
  createTime: { //数据创建时间，方便后续跟新
    type: Date,
    default: Date.now()
  }
})

// 创建模型对象
const Trailers = mongoose.model('Trailers', trailerSchema)
// 导出
module.exports = Trailers