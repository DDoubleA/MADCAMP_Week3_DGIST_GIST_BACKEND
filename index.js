const express = require('express')
const router = express.Router()
const app = express()
const unist = require('.//router/unist')
const dgist = require('.//router/dgist')
const gist = require('.//router/gist')


app.use('/unist', unist)
app.use('/dgist', dgist)
app.use('/gist', gist)
app.get('/', function(req, res) {
    res.send('hello here is home page')
})

const port = 8080
app.listen(port, () =>{
    console.log(`Server listening at %d`,port)
})


