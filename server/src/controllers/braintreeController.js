const braintree = require('braintree');
const Order = require('../models/orderModel');
const User = require('../models/usermodel');
const { braintreeMerchantId, braintreePublicKey, braintreePrivateKey } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');
const { orderConfirmationTemplate } = require('../helper/emailTemplates');

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
        gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        }, async (error, result) => {
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
                await order.save();

                // Send order confirmation email
                try {
                    const user = await User.findById(req.user._id);
                    const populatedOrder = await Order.findById(order._id)
                        .populate('products.product', 'name price');

                    const emailData = {
                        email: user.email,
                        subject: `Order Confirmed - #${order._id}`,
                        html: orderConfirmationTemplate(populatedOrder, user)
                    };
                    await emailWithNodeMailer(emailData);
                } catch (emailError) {
                    console.error('Error sending order confirmation email:', emailError);
                    // Don't fail the order if email fails
                }

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

