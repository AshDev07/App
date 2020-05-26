const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));

mongoose.connect('mongodb+srv://test:test@users-b0jdi.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});

//User Schema & model
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);


app.get('/profile', (req,res) => {
    res.render('profile.ejs');
});

app.get('/login', (req,res) => {
    res.render('login.ejs');
});

app.get('/signup', (req,res) => {
    res.render('signup.ejs');
});

//Sign Up
app.post('/signup', async (req, res) => {
    try{

        const emailExists = await User.exists({
            email: req.body.email
        });
        if(emailExists){
            console.log('User exists')
            res.render('/signup');
        } else{
            // const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                // password: hashedPassword
                password: req.body.password
            })

            newUser.save();
            console.log('Account created')
            res.redirect('/login');
        }
    } catch{
        res.render('/signup')
    }
});

//Log In
app.post('/login', async (req, res, next)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(user == null){
            console.log('No User')
            res.redirect('/login');
        } else{
            // const isPassword = await bcrypt.compare(req.body.password, User.password);
            if(req.body.password === User.password){
                console.log('Profile verified')
                res.render('/profile');
            } else{
                console.log('Wrong password')
                res.render('/login')
            }
        }
    } catch{
        console.log('An error occured')
        res.render('/login')
    }
})

app.listen(3000);