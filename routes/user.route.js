const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer');
var transporter =nodemailer.createTransport({
service:'gmail',
auth:{
user:'ahmad.jemel10@gmail.com',
pass:'qhzhrdxfeqzxwutw'
},
tls:{
rejectUnauthorized:false
}
})
require('dotenv').config()
//Register
router.post('/register',async (req, res) => {
try {
let { email, password, firstname, lastname } = req.body

const user = await User.findOne({ email })
if (user) return res.status(404).send({ success: false, message: "User already exists" })

const newUser = new User({ email, password, firstname, lastname })
const createdUser = await newUser.save()
// Envoyer l'e-mail de confirmation de l'inscription
var mailOption ={
from: '"verify your email " <ahmad.jemel10@gmail.com>',
to: newUser.email,
subject: 'vérification your email ',
html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
<h4>please verify your email to procced.. </h4>
<a href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">clickhere</a>`
}
transporter.sendMail(mailOption,function(error,info){
if(error){
console.log(error)
}
else{
console.log('verification email sent to your gmail account ')
}
})
//const url =`http://localhost:3000/activate/${token}`;
return res.status(201).send({ success: true, message: "Account createdsuccessfully", user: createdUser })
} catch (err) {
console.log(err)
res.status(404).send({ success: false, message: err })
}
});

// afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
try {
const users = await User.find().select("-password");
res.status(200).json(users);
} catch (error) {
res.status(404).json({ message: error.message });
}
});

// se connecter
router.post('/login', async (req, res) => {
try {
let { email, password } = req.body
if (!email || !password) {
return res.status(404).send({ success: false, message: "All fields arerequired" })
}
let user = await User.findOne({ email }).select('+password').select('+isActive')

if (!user) {

return res.status(404).send({ success: false, message: "Account doesn't exists" })
} else {
let isCorrectPassword = await bcrypt.compare(password, user.password)
if (isCorrectPassword) {

delete user._doc.password
if (!user.isActive) return res.status(200).send({ success: false,
message: 'Your account is inactive, Please contact your administrator' })

const token = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);
return res.status(200).send({ success: true, user,token,refreshToken })
} else {
return res.status(404).send({ success: false, message: "Please verify your credentials" })

}
}
} catch (err) {
return res.status(404).send({ success: false, message: err.message })
}
});
//Access Token
const generateAccessToken=(user) =>{
return jwt.sign ({ iduser: user._id, role: user.role }, process.env.SECRET, {
expiresIn: '60s'})
}
// Refresh
function generateRefreshToken(user) {
return jwt.sign ({ iduser: user._id, role: user.role },
process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y'})
}
//Refresh Route
router.post('/refreshToken', async (req, res, )=> {
console.log(req.body.refreshToken)
const refreshtoken = req.body.refreshToken;
if (!refreshtoken) {
return res.status(404).send({success: false, message: 'Token Not Found' });
}
else {
jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
if (err) { console.log(err)
return res.status(406).send({ success: false,message: 'Unauthorized' });
}
else {
const token = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);
console.log("token-------",token);
res.status(200).send({success: true,
token,
refreshToken
})
}
});
}

});

/**
* as an admin i can disable or enable an account
*/
router.get('/status/edit/', async (req, res) => {
try {
let email = req.query.email
console.log(email)
let user = await User.findOne({email})
user.isActive = !user.isActive
user.save()
res.status(200).send({ success: true, user })
} catch (err) {
return res.status(404).send({ success: false, message: err })
}
})
module.exports = router;