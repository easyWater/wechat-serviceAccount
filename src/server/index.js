const db = require('../db');
const theatersCrawler = require('./crawler/theatersCrawler');
const saveTheaters = require('./save/saveTheaters');
const uploadQiniu = require('./qiniu');

(async () => {
  // 连接数据库
  await db;
  // 爬取数据
  // const data = await theatersCrawler();
  // 将爬取的数据保存在数据库中
  // await saveTheaters(data);
  await uploadQiniu()
})()