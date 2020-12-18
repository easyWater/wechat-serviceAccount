const db = require('../db');
const theatersCrawler = require('./crawler/theatersCrawler');
const trailersCrawler = require('./crawler/trailersCrawler');
const saveTheaters = require('./save/saveTheaters');
const saveTrailers = require('./save/saveTrailers');
const uploadQiniu = require('./qiniu');
const Theaters = require('../model/Theaters');
const Trailers = require('../model/Trailers');


module.exports = async () => {
  // 连接数据库
  await db;

  // 爬取热门数据
  const theatersData = await theatersCrawler();
  // 将爬取的数据保存在数据库中
  await saveTheaters(theatersData);
  // 将图片上传至七牛云
  await uploadQiniu('posterKey', Theaters)

  // 爬取预告片数据
  const trailersData = await trailersCrawler()
  // 保存在数据库中
  await saveTrailers(trailersData);
  // 将图片视频上传至七牛云
  await uploadQiniu('posterKey', Trailers)
  await uploadQiniu('coverKey', Trailers)
  await uploadQiniu('videoKey', Trailers)
}