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
    // console.log(userId);
    // console.log(taken);
    user.findOne({UserID: userId}).then((doc) =>{
        if(doc == null) { //save
            const newuser = new user({
                UserID : userId,
                taken : taken
            })
            newuser.save().then(() => console.log('Saved successfully'));
        } else {// edit
            user.updateOne({_id: doc._id}, {$push : {taken: taken}}).then(console.log('updated'))
        }
    })
   
})
//courses 정보 요청 
app.get('/user/:id', function(req, res){
    // console.log("here")
    // console.log(req.params.id)
    let id = req.params.id

    user.findOne({'UserID':id}).then((result=> {
        console.log(result.UserID)
        res.json(result.taken)
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
            // console.log(`doc.PassWord`, doc.PassWord)
            // console.log(`PassWord`, PassWord)
            if (doc.PassWord == PassWord){
                res.send(`correct`)
            }
            else{
                res.send(`Wrong Password`)
            }
        }
    })

    // console.log(req.body.pw)
})
//회원가입 요청
app.post('/register', function(req,res){
    console.log("register post ", req.body)
    let userId = req.body.id
    let PassWord = req.body.pw 
    user.findOne({UserID: userId}).then((doc) =>{
        if(doc == null) { //save
            const newuser = new user({
                UserID : userId,
                PassWord : PassWord
            })
            newuser.save().then(() => console.log('Saved successfully'));
            res.send(`registered successfully`)
        } else {// edit
            res.send(`duplicated ID`)
        }
    })

})


// newuser.save(function(err, newuser){
//     if(err) return console.error(err);
//     // console.dir(newuser.body);
// });


// console.log(user.find())
