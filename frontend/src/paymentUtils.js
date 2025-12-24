import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const handlePayment = async (event, userEmail, userId) => {
  try {
    // 🛡️ THE FIX: Stripe crashes if the image URL is > 2000 characters.
    // This check uses a placeholder if the event image is a long Base64 string.
    const stripeSafeImage = (event.image && event.image.length < 2000) 
      ? event.image 
      : 'https://placehold.co/600x400?text=Event+Ticket';

    const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event: {
          _id: event._id,
          title: event.title,
          price: event.price,
          image: stripeSafeImage // Use the safe URL
        }, 
        userEmail,
        userId 
      }),
    });

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error);
    }

    if (session.url) {
      window.location.href = session.url;
    } else {
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: session.id });
    }

  } catch (error) {
    console.error("❌ Payment Error:", error);
    alert("Payment failed: " + error.message);
  }
};