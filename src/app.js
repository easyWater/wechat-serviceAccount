const express = require('express')
const auth = require('./wechat/auth')

const app = express()
app.use(auth())

app.listen(3000, () => console.log('服务器启动成功，3000端口开启~'))