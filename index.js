const express = require('express')
const router = express.Router()
const app = express()
const dgist = require('.//router/dgist')
const users = require('.//router/users')
const cors = require('cors');
const mongoose = require('mongoose')
const { colours } = require('nodemon/lib/config/defaults')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const port = 443
mongoose.connect('mongodb+srv://junyoung:junyoung@tweet.frfvm.mongodb.net/dgist?retryWrites=true&w=majority', {
  }).then(console.log('DB is connected'));
app.listen(port, () =>{
    console.log(`Server listening at %d`,port)
})




const {Schema} = mongoose

const UserSchema = new Schema({
    UserID : String,
    PassWord : String,
    SI : Number,
    School : String,
    Major : {전공타입 : String,
            전공명1 : String,
            전공명2 : String},

    taken : [{과목번호: String,
            교과목명:  String,
            이수구분: String,
            교과분야: String,
            교과영역: String,
            학위구분: String,
            학점    : Number,
            비고    :String
        }]
})

const user = mongoose.model('users',UserSchema);
    
app.use('/dgist', dgist)
app.use('/users', users)
app.get('/', function(req, res) {
    // console.log("hello")
})

//제출하기 Course.jsx/ handleSubmit => {userid : {userId} , taken : {isheard}, SI: {SI}, School: {School}, Major : {Major}}
app.post('/user', function(req, res) {
    // console.log(`req.body`, req.body)
    let userId = req.body.userid.userId
    let taken = req.body.taken.isheard
    let SI = req.body.SI.SI
    let School = req.body.School
    let Major = req.body.Major.major
    user.findOne({UserID: userId}).then((doc) =>{
        // edit information
        user.updateOne({_id: doc._id}, {$set : {taken: taken, SI: SI, School: School, Major : Major}}).then(console.log(userId,' submitted courses'))
    })
   
})

//courses 정보 요청 
app.get('/user/:id', function(req, res){
    let id = req.params.id
    user.findOne({'UserID':id}).then((result=> {
        console.log(result.UserID, "requested taken Courses")
        res.json({taken: result.taken, SI: result.SI, Major: result.Major})
    }))
})

//로그인 요청
app.post('/login', function(req,res) {
    console.log("login post", req.body)
    let userId =req.body.id
    let PassWord = req.body.pw 
    user.findOne({UserID: userId}).then((doc) =>{
        if(doc == null) { //DB에 user 정복 없을 때 로그인 불가
            res.send(`There is no registered ID`)
        } else {
            if (doc.PassWord === PassWord){// taken Course 정보가 있고 db password와 일치하면 로그인
                // res.send(`courses`) // 기존 이동
                if(doc.taken.length == 0){ // taken Course 정보가 없으면 Survey로
                    res.send(`correct`) // new user
                }
                else if(doc.School === "dgist"){
                    res.send(`dgist`)
                }
                else if(doc.School === "gist"){
                    res.send(`gist`)
                }
                else( // 기존 학교 없을 때 가입한 유저?
                    res.send(`courses`)
                ) 
            }
            else{ // 틀리면 로그인 불가
                res.send(`Wrong Password`)
            }
        }
    })
})

//회원가입 요청
app.post('/register', function(req,res){
    // console.log("register post ", req.body)
    let userId = req.body.id
    let PassWord = req.body.pw 
    user.findOne({UserID: userId}).then((doc) =>{
        if(doc == null) { //save
            const newuser = new user({
                UserID : userId,
                PassWord : PassWord,
                SI : 0
            })
            newuser.save().then(() => console.log(userId, 'registered successfully'));
            res.send(`registered successfully`)
        } else {// edit
            res.send(`duplicated ID`)
        }
    })

})

app.post('/kakao', function(req,res) {
    console.log("login post", req.body)
    let userId =req.body.id
    let PassWord = req.body.pw 
    user.findOne({UserID: userId}).then((doc) =>{
        if(doc == null) { //save
            const newuser = new user({
                UserID : userId,
                PassWord : PassWord,
                SI : 0
            })
            newuser.save().then(() => console.log('Saved successfully from kakao'))
            res.send(`correct`)
        }else {// edit
            if(doc.taken.length == 0){
                res.send(`correct`) // go to survey
            }
            else{
                res.send(`courses`) // go to result
            }
        }
    })

})



