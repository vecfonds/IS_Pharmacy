const express = require("express");

const mysql = require('mysql');

const PORT = process.env.PORT || 4000;

const app = express();

const bodyParser = require('body-parser');

const passport = require('passport')
const initPassport = require('./passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const TIMEOUT = 1 * 60 * 60;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// CONECTION TO MYSQL

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'pharmacy'
});

////////////////////////////
//          TEST          //
////////////////////////////

app.get("/api/tests", (req, res) => {
    console.log("success");
    res.json({ message: "Hello from server!" });
});

///////////////////////////
//          GET          //
///////////////////////////
// Form: /api/get/...

///// Cat /////
app.get('/api/get/doctors', (req, res) => {
    var sql = "SELECT * FROM DOCTOR";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({ doctors: results });
    });
});

app.get('/api/get/drugs', (req, res) => {
    var sql = "SELECT * FROM DRUG";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({ drugs: results });
    });
});

///// Phuc /////

app.use(cookieParser());
app.use(session({ secret: "key", cookie: { expires: TIMEOUT } }));
app.get("/", (req, res) => {
    if (req.session.count) {
        req.session = { user: {}, count: 0, resave: false }
    } else req.session.count++;
});
app.get('/api/get/users', (req, res) => {

    res.json({ user: req.session.user })
});
app.post('api/post/regist', (req, res) => {
    console.log(req.session)
    var sql = `INSERT INTO system_user (phone, firstname, lastname, dateofbirth, address, email, pwd) VALUES 
        (${req.query.phone}," ${req.query.firstname}","${req.query.lastname}",
        "${req.query.dateofbirth}","${req.query.address}","${req.query.email}","${req.query.pwd}")`
    connection.query(sql, function(err, results) {
        alert("INTO")
    });

})

app.get('/api/get/phuc', (req, res) => { console.log(req.session) })

app.post('/api/get/login', (req, res) => {

    //TODO get role, return role with result    
    var sql = `SELECT * FROM system_user where phone=${req.body.query.phone}`
    connection.query(sql, function(err, results) {
        res.json({ users: {results, role:"Patient"} });
        //TODO fix session type
        req.session.user = results[0]
    //     console.log(req.session)
        
    });
});

app.get('api/get/patientInfo',(req,res)=>{
    var sql=`SELECT * FROM patient where phone=${req.query.phone}`
    connection.query(sql, function(err, results) {
        res.json({ patients: results });
    });
}
)

///// Chanh /////

///// Dung /////

//////////////////////////////
//          UPDATE          //
//////////////////////////////
// Form: /api/update/...


///// Cat /////

///// Phuc /////
app.post('api/update/patientInfo',(req,res)=>{
    var sql=`UPDATE patient
        SET medical_history=${req.query.medical_history},
            height=${req.query.height},
            weight=${req.query.weight},
            blood_type=${req.query.blood_type}, 
            medical_background=${req.query.medical_background}
    WHERE phone=${req.query.phone}`
    connection.query(sql, function(err, results) {
        res.json({ patients: req.query });
    });
}
)
app.post('api/post/forgetpwd',(req,res)=>{
    var sql=`UPDATE system_user SET pwd = ${req.query.pwd}
            WHERE phone=${req.query.phone}`
    connection.query(sql, (err,results)=>{
        if (err) throw err;
    })
    //Go to ogin
})
app.post('api/post/newpwd',(req,res)=>{
    var sql=`UPDATE system_user SET pwd = ${req.query.pwd}
            WHERE phone=${req.query.phone}`
    connection.query(sql, (err,results)=>{
        if (err) throw err;
    })
    //Go to ogin
})
///// Chanh /////

///// Dung /////


//////////////////////////////
//          DELETE          //
//////////////////////////////
// Form: /api/delete/...


///// Cat /////

///// Phuc /////

///// Chanh /////

///// Dung /////

//////////////////////////////
//          INSERT          //
//////////////////////////////
// Form: /api/insert/...


///// Cat /////

///// Phuc /////

///// Chanh /////

///// Dung /////

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});













const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 4000,
        user: 'root',
        password: '123456',
        database: 'pharmacy'
    }
});