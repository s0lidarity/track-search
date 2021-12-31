const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({email, password});
        await user.save();

        const token = jwt.sign({user: user._id}, 'MY_SECRET_KEY');

        res.send({token});
    } catch (err) {
        return res.status(422).send({err});
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || ! password ) return res.status(422).send({error: "Must provide email and passwword"});

    const user = await User.findOne({email});
    if(!user) return res.status(404).send({error: "Email not registered"});

    try {
        await user.comparePassword(password);
        const token = jwt.sign({user: user._id}, 'MY_SECRET_KEY');
        res.send({token});
    } catch (err){
        return res.status(401).send({erro: "Invalid email/password combination"});
    };
    


});

module.exports = router;