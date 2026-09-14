const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')

router.get('/', isSignedIn, (req,res)=>{
    Listing.create({
        size: req.body.size,
        title: req.body.title,
        owner: req.session.user._id //This is to automatically put the user in session as the owner of the listing
    })
    res.render('homepage.ejs')
})
module.exports = router;
