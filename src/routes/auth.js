require('dotenv').config();
const router = require('express').Router();
require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const cart = require('../model/cart');
const checkAuth = require('../middleware/checkAuth');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const KEY = process.env.KEY;

router.post('/signup', async(req, res) => {

    const { email, password, fname, lname } = req.body;
    console.log("body of signup  " , req.body);
    const isUserExist = await user.findOne({ email: email });
    if (isUserExist) {
      //  console.log("isUserExist");
        return res.status(400).json({
            error: [
                {
                    msg: "User of this email already exist"
                }
            ]
        })
    } else {
        
        const hashedPasswoed = await bcrypt.hash(password, 10);
      //  console.log(KEY , hashedPasswoed);
        const token = jwt.sign({
            email
        }, KEY , {
            expiresIn: 360000
        })
        console.log({token});
        try {
            const customer = await stripe.customers.create({
                email,
                description: `name: ${fname} , email: ${email}`,
              });
              console.log('customer id => ', customer);
            const new_user = await user.create({
                email,
                password: hashedPasswoed,
                firstname: fname,
                lastname: lname,
                'payment.customer_id' : customer
            });
            console.log({new_user});
            res.status(201).json({
                token,
                success: true
            });
        } catch (e) {

            res.status(400).send(e);
        }
    }

});

router.post('/login', checkAuth , async (req, res) => {
    try {
        const { email, password } = req.body;
        const  Token  = req.user;
        console.log("token  " , Token)
        console.log("emil " , email);
        const loginuser = await user.findOne({ email: email.toLowerCase() });
        console.log("loginuser  " , loginuser);
        if (!loginuser) {
           // console.log('error');
            return res.status(400).json({
                error: [
                    {
                        msg: "Invalid EEmail Or Password!"
                    }
                ]
            })
        }

        const isMatch = await bcrypt.compare(password , loginuser.password);
        console.log({isMatch})
        if (!isMatch) {
            console.log('error pas');
            return res.status(400).json({
                error: [
                    {
                        msg: "Invalid Email Or Passwordd!"
                    }
                ]
            })
        }


        try{
            if(Token) await cart.updateMany({ userId: Token },{ $set: {userId: email.toLowerCase()}})
        }catch(e){
            res.send(e);
        }

        const token = jwt.sign({
            email
        }, KEY , {
            expiresIn: 360000
        })
    
        res.status(200).json({
            user: loginuser,
            token: token
        });
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/getUsers', async (req, res) => {
    const allUsers = await user.find();
    res.send(allUsers);
})


module.exports = router;