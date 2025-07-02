const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: 50000, // 500 € en centimes
  currency: 'eur',
  capture_method: 'manual', // ✅ bloque sans encaisser
  payment_method_types: ['card'],
  description: 'Caution location hébergement',
});
