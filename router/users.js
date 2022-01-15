const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    // res.send('hello dgist');
    console.log("here is userpage")
});

router.post('/', (req,res)=>{
    const id = req.body.id
    const pw = req.body.pw
    console.log(id, pw)
})

module.exports = router;
