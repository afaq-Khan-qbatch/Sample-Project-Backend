require('dotenv').config();
const router = require('express').Router();
require('mongoose');
const Item = require('../model/item');

router.get('/get_items', async(req , res) =>{
    const item_data = await Item.find();
  //  console.log({item_data})
    res.send(item_data);
})

router.post('/add' , async(req , res) =>{
    console.log('inininn == > ', req.body);
    let new_item = new Item(req.body);
    try {
        new_item = await new_item.save()
    } catch (err) {
        console.log('err ==> ', err);
    }
     res.status(200).send({new_item})

})

router.get('/getDescription/:id' , async(req , res) => {
    const {id} = req.params;
    const desItem = await Item.findById(id);
    if(desItem){
        res.send(desItem);
    }
    else{
        res.send('id not found');
    }
})

module.exports = router;