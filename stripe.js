const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
app.use(cors()); 

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
      
        const { productos } = req.body;

      
        const line_items = productos.map(item => ({
            price_data: {
                currency: 'eur', 
                product_data: {
                    name: item.nombre, 
                },
                unit_amount: item.precio * 100, 
            },
            quantity: item.cantidad,
        }));


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: 'https://pagina-web-techconectjl.onrender.com/exito.html',
            cancel_url: 'https://pagina-web-techconectjl.onrender.com/carrito.html',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error al crear la sesión de Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});