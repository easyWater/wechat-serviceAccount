const express = require('express')
const path = require('path')

const router = require('./router')

const app = express()

// 配置模板资源目录
app.set('views', path.join(__dirname, 'views/'))
// 配置模板引擎
app.set('view engine', 'ejs')

// 路由
app.use(router)

app.listen(3000, () => console.log('服务器启动成功，3000端口开启~'))