const express = require('express')
const router = express.Router()
const app = express()
const dgist = require('.//router/dgist')
const mongoose = require('mongoose')


const port = 443
mongoose.connect('mongodb+srv://junyoung:junyoung@tweet.frfvm.mongodb.net/dgist?retryWrites=true&w=majority', {
  }).then(console.log('DB is connected'));
app.listen(port, () =>{
    console.log(`Server listening at %d`,port)
})

app.use('/dgist', dgist)

app.get('/', function(req, res) {
    res.send('hello here is home page')
})




const {Schema} = mongoose

const UserSchema = new Schema({
    UserID : String,
    taken : [{과목번호: String,
            교과목명:  String,
            이수구분: String,
            교과분야: String,
            교과영역: String,
            학위구분: String,
            학점    : String,
            비고    :String
        }]
    
})

const user = mongoose.model('users',UserSchema);

function getByuserId(userId) {
    return user.find({'UserID' : userId }).then((result) => {
            console.log(result)
            return result})
}
function getByall() {
    return user.find();
}

    

var newuser = new user({
    UserID : "최준영",
    taken :[{과목번호: 'cse496', 교과목명: '몰입캠프'},{과목번호 : 'cse234', 교과목명: '간다'}]
});
// newuser.save(function(err, newuser){
//     if(err) return console.error(err);
//     // console.dir(newuser.body);
// });


// console.log(user.find())
