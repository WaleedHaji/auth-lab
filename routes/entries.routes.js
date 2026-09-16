const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const Entry = require('../models/Entry')

router.get('/new', (req,res) =>{
    res.render('entries/new.ejs')
})

router.post('/', isSignedIn, async (req,res)=>{
  const createdEntry = await Entry.create({
        size: req.body.size,
        title: req.body.title,
        owner: req.session.user._id //This is to automatically put the user in session as the owner of the listing
    })
    res.redirect('/all-entries')
})

module.exports = router