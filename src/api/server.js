import express from "express";
import Stripe from "stripe";
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const stripe = new Stripe(
    // This is your test secret API key.
    'sk_test_51Ig94GGwgS0qnVOVRggeHRD8GnsDXDz4IuXzI8DHbezmT4CJSSItElsEN9SGXJr35eW4hJLA8ve7FWCatMO0ZRHR00lXyh0MQF',
    {
        apiVersion: "2023-10-16",
    }
);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

app.use(express.json());

app.post("/account_session", async (req, res) => {
    try {
        const { account } = req.body;

        const accountSession = await stripe.accountSessions.create({
            account: account,
            components: {
                account_onboarding: { enabled: true },
                account_management: { enabled: true },
                notification_banner: { enabled: true },
            },
        });

        res.json({
            client_secret: accountSession.client_secret,
        });
    } catch (error) {
        console.error(
            "An error occurred when calling the Stripe API to create an account session",
            error
        );
        res.status(500);
        res.send({ error: error.message });
    }
});

app.post("/account", async (req, res) => {
    try {
        const account = await stripe.accounts.create({
            controller: {
                stripe_dashboard: {
                    type: "none",
                },
            },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
            country: "FR",
        });

        res.json({
            account: account.id,
        });
    } catch (error) {
        console.error(
            "An error occurred when calling the Stripe API to create an account",
            error
        );
        res.status(500);
        res.send({ error: error.message });
    }
});

// Add these functions to fetch product, plan, and payment link data from your database
const fetchProductDataForCheckout = async (productId) => {
    const { data, error } = await supabase.rpc('fetch_product_data_for_checkout', { p_product_id: productId });
    if (error) {
        throw error;
    }
    return data[0];
};

const fetchPlanDataForCheckout = async (planId) => {
    const { data, error } = await supabase.rpc('fetch_plan_data_for_checkout', { p_plan_id: planId });
    if (error) {
        throw error;
    }
    return data[0];
};

const fetchPaymentLinkDataForCheckout = async (linkId) => {
    const { data, error } = await supabase.rpc('fetch_payment_link_data_for_checkout', { p_link_id: linkId });
    if (error) {
        throw error;
    }
    return data[0];
};

// Add routes for handling product and plan data
app.get("/api/products/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await fetchProductDataForCheckout(productId);
        res.json(product);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/api/plans/:planId", async (req, res) => {
    const { planId } = req.params;
    try {
        const plan = await fetchPlanDataForCheckout(planId);
        res.json(plan);
    } catch (error) {
        console.error('Error fetching plan data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/api/payment-links/:linkId", async (req, res) => {
    const { linkId } = req.params;
    try {
        const paymentLink = await fetchPaymentLinkDataForCheckout(linkId);
        res.json(paymentLink);
    } catch (error) {
        console.error('Error fetching payment link data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle all other routes by serving the index.html file
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"));
});

app.listen(4242, () => console.log("Node server listening on port 4242! Visit http://localhost:4242 in your browser."));

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'connect.account.updated':
            handleConnectAccountUpdated(event.data.object);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

// Define the function to handle the connect.account.updated event
const handleConnectAccountUpdated = (account) => {
    console.log('Connect account updated:', account.id);
    // Implement your logic here to handle the account update event
    // For example, you can update your database with the new account information
};
