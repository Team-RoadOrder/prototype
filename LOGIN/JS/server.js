const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'krumin0319',
    database: 'testdb'
});

db.connect(err => {
    if(err) console.error('DB 연결 실패', err);
    else console.log('MySQL 연결 성공');
});

// 회원가입 API (기존)
app.post('/api/register', (req, res) => {
    const { name, id, pw } = req.body;
    if(!name || !id || !pw) return res.status(400).json({ message: '모든 값 입력 필요' });

    const sql = 'INSERT INTO users (name, userid, password) VALUES (?, ?, ?)';
    db.query(sql, [name, id, pw], (err, result) => {
        if(err) return res.status(500).json({ message: '회원가입 실패' });
        res.json({ message: '회원가입 성공!' });
    });
});

// 로그인 API
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    if(!id || !password) return res.status(400).json({ success:false, message: '모든 값 입력 필요' });

    const sql = 'SELECT * FROM users WHERE userid = ? AND password = ?';
    db.query(sql, [id, password], (err, results) => {
        if(err) return res.status(500).json({ success:false, message: '서버 오류' });
        if(results.length > 0) {
            res.json({ success:true, message: '로그인 성공' });
        } else {
            res.json({ success:false, message: '아이디 또는 비밀번호가 올바르지 않습니다' });
        }
    });
});

app.listen(port, () => console.log(`서버 실행: http://localhost:${port}`));

