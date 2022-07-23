require('dotenv').config();
require('mongoose');
const user = require('../model/user');
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

router.post('/deductPayment', async (req, res) => {
    const { email, subscription_type, token } = req.body;
    console.log('\n\n', 'body', { email, subscription_type, token });

    if (email && subscription_type && token) {
        let price;
        const { payment } = await user.findOne({ email: email }, { payment: 1, _id: false });
        const customerId = payment.customer_id.id;
        console.log('\n\n', 'customerId => ', customerId);

        if (subscription_type == '50$') price = 'price_1JlBzBGbPq8HgjNUrGAgL56J'
        else if (subscription_type == '60$') price = 'price_1JlBzBGbPq8HgjNUNE1zelCS'
        else if (subscription_type == '70$') price = 'price_1JlBzBGbPq8HgjNUkj28RsYP'

        console.log('\n\n', 'price => ', price);

        try {
            // const customer = await stripe.customers.retrieve(customerId);
            // console.log('\n\n', 'customer', customer);
            // const response = await stripe.customers.update( customerId, { 
             
            //     "invoice_settings.default_payment_method": token.id
            
            // });

            const response = await stripe.paymentMethods.attach(
                token.id, {
                  customer: customerId,
                }
              );
              console.log('response => ', response);
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                default_payment_method: response.id,
                items: [
                    { price },
                ],
            });
            await user.update({ 'payment.customer_id': payment.customer_id }, { 'payment.subscription_id': subscription });
            res.send('subscribed..');
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    } else {
        res.status(400).json({
            error: "incomplete user data"
   
        })
    }

})

module.exports = router;