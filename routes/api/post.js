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

//like  post
router.put('/like/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        //check if already liked by user
        if(post.like.filter(single => single.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already liked'})
        }

        post.like.unshift({user: req.user.id})

        await post.save()
        res.json(post.like)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})
//unlike post
router.put('/unlike/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        //check if already liked by user
        if(post.like.filter(single => single.user.toString() === req.user.id).length == 0){
            return res.status(400).json({msg: 'Post have not been liked'})
        }

        const removeIndex = post.like.map(single => single.user.toString()).indexOf(req.user.id)
        post.like.splice(removeIndex, 1)
        await post.save()
        res.json(post.like)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})
//add comment
router.post("/comment/:id", [auth, 
    [
       check('text', 'Text is required').not().isEmpty() 
    ]],async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        
        try{
            const user = await User.findById(req.user.id).select("-password")
            const post = await Post.findById(req.params.id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment)
            await post.save()
            res.json(post.comments)
        }catch(err){
            console.log(err)
            res.status(500).send('Server Error')
        }
})
//delete comment
router.delete("/comment/:id/:comment_id", auth,async (req, res) => {
        
        try{
            const post = await Post.findById(req.params.id)
            const comment = post.comments.find(comment => comment.id === req.params.comment_id)
            if(!comment){
                res.status(404).json({msg: 'Comment does not exist!'})
            }

            if(comment.user.toString() !== req.user.id){
                res.status(401).json({msg: 'You are not allowed to delete this comment!'})
            }

            const removeIndex = post.comments.map(single => single.user.toString()).indexOf(req.user.id)
            post.comments.splice(removeIndex, 1)
            await post.save()
            res.json(post.comments)
        }catch(err){
            console.log(err)
            res.status(500).send('Server Error')
        }
})
module.exports = router