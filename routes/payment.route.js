const express=require('express');
const router = express.Router();
const stripe = require ('stripe');
const Stripe =
stripe('sk_test_51NXUI3Hw2e1EYQH498gV6eO2DgcNHz9jrZKebxl1Pi69ryXTTH6DsSyakfG1ED77vg0uqEhXrWwYFGPT0CC72VmC003MA3geOk');
router.post('/', async (req, res) => { console.log(req.body)
let status, error;
const { token, amount } = req.body;

try {
await Stripe.charges.create({
source: token.id,
amount,
currency: 'usd',
});
status = 'success';
} catch (error) {
console.log(error);
status = 'Failure';
}
res.json({ error, status });
}); 
module.exports = router;