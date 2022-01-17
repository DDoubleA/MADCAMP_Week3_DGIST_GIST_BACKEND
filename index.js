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

//제출하기
app.post('/user', function(req, res) {
    // console.log("dasssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    let userId = req.body.userid.userId
    let taken = req.body.taken.isheard
    let SI = req.body.SI.SI
    // console.log(userId);
    // console.log(taken);asd
    user.findOne({UserID: userId}).then((doc) =>{
        // edit
        user.updateOne({_id: doc._id}, {$set : {taken: taken, SI: SI}}).then(console.log('updated'))
    })
   
})
//courses 정보 요청 
app.get('/user/:id', function(req, res){
    let id = req.params.id

    user.findOne({'UserID':id}).then((result=> {
        console.log(result.UserID)
        res.json({taken: result.taken, SI: result.SI})
    }))
    
})

//로그인 요청
app.post('/login', function(req,res) {
    console.log("login post", req.body)
    let userId =req.body.id
    let PassWord = req.body.pw 
    user.findOne({UserID: userId}).then((doc) =>{
        if(doc == null) { //save
            res.send(`There is no registered ID`)
        } else {// edit
            if(doc.taken.length == 0){
                res.send(`correct`) // new user
            }
            else if (doc.PassWord == PassWord){
                res.send(`courses`) // login
            }
            else{
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
            newuser.save().then(() => console.log('Saved successfully'));
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



