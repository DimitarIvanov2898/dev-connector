const express = require('express')
const router = express.Router()
const { check, validationResults } = require('express-validator')

//register user
router.get('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please, include a valid email').isEmail(),
    check('password', 'Please, enter a password atleast 6 chars').isLength({min: 6})
],(req, res) => {
    const errors = validationResults(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
})

module.exports = router