// 📁 Projet Next.js déployable sur Vercel pour créer un lien de caution Stripe (500€ sans prélèvement)

// --- pages/api/create-checkout-session.js ---
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual', // ✅ Empreinte sans encaissement
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Caution hébergement Airbnb',
            },
            unit_amount: 50000, // 500€ en centimes
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la session' });
  }
}

// --- pages/index.js ---
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700"
      >
        {loading ? 'Redirection...' : 'Payer la caution (500 €)'}
      </button>
    </div>
  );
}

// --- .env.local (à créer sur Vercel ou en local) ---
// STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx

// --- Pages succès/annulation (success.js & cancel.js) ---
// Crée deux fichiers simples avec un message de confirmation ou d’annulation

// ✅ Déploie sur Vercel et configure la variable STRIPE_SECRET_KEY
