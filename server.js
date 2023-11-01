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
app.set('view engine', 'ejs')
app.use(express.json()) // res.body로 쉽게 꺼내쓸 수 있게 도와주는 코드
app.use(express.urlencoded({extended: true})) // ''
const { ObjectId } = require('mongodb') // Objectid() 쓸 수 있게 해줌 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/news', (req, res) => {
    res.send('뉴스')
})

app.get('/shop', (req, res) => {
    res.send('쇼핑페이지입니다')
})

app.get('/list', async (req, res) => {
    let result = await db.collection('post').find().toArray();
    // console.log(result[0].title);
    // res.send(result[0].title);
    res.render('list.ejs', { posts : result })
})

app.get('/time', async (req, res) => {
    res.render('time.ejs', { date : new Date() });
})

app.get('/write', async (req, res) => {
    res.render('write.ejs');
})

app.post('/add', async (req, res) => {
    if (req.body.title == '') {
        res.send('제목을 적어주세요');
    } else {
    // 예외처리와 db에 post에 저장
        try {
            await db.collection('post').insertOne({ title: req.body.title, content: req.body.content})
            res.redirect('list');
        } catch (err) {
            console.log(err)
            // res.send('db에러');
        }
    }
})

app.get('/detail/:id', async (req, res) => {
    try {
        let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id) })
        
        if (result == null) {
            res.status(400).send('404 Not Found');
        } else {
          res.render('detail.ejs', { result : result })
        }

    } catch (err) {
        // res.send('예외처리: ', err)
    }
    
})

//수정
app.get('/edit/:id', async (req, res) => {
    try {
        let result = await db.collection('post').findOne({ _id: new ObjectId(req.params.id) });
        res.render('edit.ejs', { result: result });
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 에러: 글 수정 페이지 로딩 중 오류 발생');
    }
});

app.post('/edit', async (req, res) => {
    try {
        await db.collection('post').updateOne(
            { _id: new ObjectId(req.body.id) },
            { $set: { title: req.body.title, content: req.body.content } }
        );
        res.redirect('/list');
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 에러: 글 수정 중 오류 발생');
    }
});
