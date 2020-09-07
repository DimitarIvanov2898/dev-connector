const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')

//add post
router.post("/", [auth, 
    [
       check('text', 'Text is required').not().isEmpty() 
    ]],async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        
        try{
            const user = await User.findById(req.user.id).select("-password")
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save()
            res.json(post)
        }catch(err){
            console.log(err)
            res.status(500).send('Server Error')
        }
})

//get all posts
router.get('/', auth, async (req, res) => {
    try{
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})

//get post by id
router.get('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg: 'There is no such post!'})
        }
        res.json(post)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})

//delete post by id
router.delete('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'You can not delete other people posts'})
        }
        
        await post.remove()
        return res.json({msg: 'Post removed!'})
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})
module.exports = router