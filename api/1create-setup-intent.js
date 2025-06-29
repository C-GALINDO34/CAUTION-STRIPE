import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Méthode non autorisée');
  }

  try {
    const setupIntent = await stripe.setupIntents.create();
    res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ error: 'Erreur lors de la création du setupIntent' });
  }
}

