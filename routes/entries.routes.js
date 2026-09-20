const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const Entry = require('../models/Entry')

router.get('/new', (req,res) =>{
    res.render('entries/new.ejs')
})

router.post('/', isSignedIn, async (req,res)=>{
    req.body.isPublic = Boolean(req.body.isPublic)
  const createdEntry = await Entry.create({
        title: req.body.title,
        entryBody: req.body.entryBody,
        owner: req.session.user._id, //This is to automatically put the user in session as the owner of the listing
        isPublic: req.body.isPublic
    })
    console.log(req.session.user)
    res.redirect('/entries')
})

router.get('/', async (req,res)=>{
    const allEntries = await Entry.find({isPublic:true, isDeleted:false})
    res.render('entries/all-entries.ejs', {entries: allEntries})
})

router.get('/my-entries', isSignedIn, async (req, res) => {
    try {
        // Find only entries where the owner matches the logged-in user's ID
        const foundMyEntry = await Entry.find({ owner: req.session.user._id, isDeleted:false });
        res.render('entries/my-entries.ejs', { entries: foundMyEntry });
    } catch (error) {
        console.error("Database error details:", error);
        res.send("Something went wrong loading your entries.");
    }
});

router.get('/:entriesId', async (req,res)=>{
    const detailedEntry = await Entry.findById(req.params.entriesId).populate('owner');
    res.render('entries/entry-details.ejs', {entry: detailedEntry})
})


router.delete('/:entryId', isSignedIn, async (req,res)=>{
    const foundEntry = await Entry.findById(req.params.entryId)
    if(!foundEntry.owner.equals(req.session.user._id)){
        return res.send('You are not the owner')
    }
    const deletedListing = await Entry.findByIdAndUpdate(req.params.entryId,{isDeleted: true})
    res.redirect('/entries')
})


router.get('/:entryId/edit', async (req,res)=>{
    const foundEntry = await Entry.findById(req.params.entryId)
    res.render('entries/update-entry.ejs', {entry: foundEntry})
})


router.put('/:entryId', async (req,res)=>{
    req.body.isPublic = Boolean(req.body.isPublic)
    const {title, entryBody, isPublic, owner} = req.body
    const updatedEntry = await Entry.findByIdAndUpdate(req.params.entryId, {
        title: title,
        entryBody: entryBody,
        isPublic: isPublic
    })
    res.redirect('/entries') 
})



module.exports = router