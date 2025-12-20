const braintree = require('braintree');
const Order = require('../models/orderModel');
const { braintreeMerchantId, braintreePublicKey, braintreePrivateKey } = require('../secret');

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: braintreeMerchantId || 'your_merchant_id',
    publicKey: braintreePublicKey || 'your_public_key',
    privateKey: braintreePrivateKey || 'your_private_key',
});

const getToken = async (req, res, next) => {
    try {
        gateway.clientToken.generate({}, (err, response) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(response);
        });
    } catch (error) {
        next(error);
    }
};

const processPayment = async (req, res, next) => {
    try {
        const { nonce, cart, total } = req.body;

        // Charge the user
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        }, (error, result) => {
            if (error) {
                return res.status(500).json(error);
            }
            if (result.success) {
                // Create Order
                const order = new Order({
                    products: cart,
                    payment: result,
                    buyer: req.user._id,
                });
                order.save();
                res.json({ ok: true });
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getToken, processPayment };
