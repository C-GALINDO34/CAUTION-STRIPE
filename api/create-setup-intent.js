const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const setupIntent = await stripe.setupIntents.create();
    res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error("Erreur Stripe :", error.message);
    res.status(500).json({ error: error.message });
  }
}
