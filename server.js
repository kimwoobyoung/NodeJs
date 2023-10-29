const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://admin:qwer1234@cluster0.3juyfhs.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')

  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })

}).catch((err)=>{
  console.log(err)
})

const express = require('express') // express 라이브러리 사용하겠다는 뜻
const app = express()   // ""

app.use(express.static(__dirname + '/public')); // public 폴더 등록

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/news', (req, res) => {
    res.send('뉴스')
})

app.get('/shop', (req, res) => {
    res.send('쇼핑페이지입니다')
})

