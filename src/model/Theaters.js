// 引入mongoose
const mongoose = require('mongoose')
// 获取Schema
const Schema = mongoose.Schema

// 创建约束对象
const theaterSchema = new Schema({
  title: String,
  score: Number,
  duration: String,
  directors: String,
  actors: String,
  posters: String,
  genres: [String],
  summary: String,
  doubanId: {
    type: Number,
    unique: true
  },
  releaseDate: String,
  posterKey: String, //图片上传到七牛云，返回的key值
  createTime: { //数据创建时间，方便后续跟新
    type: Date,
    default: Date.now()
  }
})

// 创建模型对象
const Theaters = mongoose.model('Theaters', theaterSchema)
// 导出
module.exports = Theaters