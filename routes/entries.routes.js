const router = require("express").Router()


router.get('/new', (req,res) =>{
    res.render('entries.ejs')
})

module.exports = router