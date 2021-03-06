// 引入mongoose
const mongoose = require('mongoose')
// 获取Schema
const Schema = mongoose.Schema

// 创建约束对象
const danmuSchema = new Schema({
  doubanId: String,
  author: String,
  time: Number,
  text: String,
  color: String,
  type: Number
})

// 创建模型对象
const Danmus = mongoose.model('Danmus', danmuSchema)
// 导出
module.exports = Danmus