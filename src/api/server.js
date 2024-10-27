import express from "express";
import Stripe from "stripe";
import path from 'path';
import { fileURLToPath } from 'url';
// import { createClient } from '@supabase/supabase-js';
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
// const supabaseUrl = process.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// app.post('/api/checkout/customer', async (req, res) => {
//     try {
//         const { merchantId, organizationId, customerDetails } = req.body;

//         const { data, error } = await supabase.rpc('create_or_update_customer', {
//             p_merchant_id: merchantId,
//             p_organization_id: organizationId,
//             p_name: customerDetails.name,
//             p_email: customerDetails.email,
//             p_phone_number: customerDetails.countryCode + customerDetails.phoneNumber,
//             p_country: customerDetails.country,
//             p_city: customerDetails.city,
//             p_address: customerDetails.address,
//             p_postal_code: customerDetails.postalCode,
//         });

//         if (error) {
//             console.error('Error creating or updating customer:', error);
//             res.status(500).json({ error: 'Failed to create or update customer' });
//         } else {
//             res.status(200).json({ customerId: data });
//         }
//     } catch (error) {
//         console.error('Error in /api/checkout/customer:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.get('/api/checkout/data', async (req, res) => {
//     try {
//         const { linkId } = req.query;

//         const { data, error } = await supabase.rpc('fetch_data_for_checkout', { p_link_id: linkId });

//         if (error) {
//             console.error('Error fetching checkout data:', error);
//             res.status(500).json({ error: 'Failed to fetch checkout data' });
//         } else {
//             res.status(200).json(data[0]);
//         }
//     } catch (error) {
//         console.error('Error in /api/checkout/data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.get('/api/checkout/logo', async (req, res) => {
//     try {
//         const { logoUrl } = req.query;

//         const { data, error } = await supabase.storage.from('logos').download(logoUrl);

//         if (error) {
//             console.error('Error downloading logo:', error);
//             res.status(500).json({ error: 'Failed to download logo' });
//         } else {
//             res.status(200).send(data);
//         }
//     } catch (error) {
//         console.error('Error in /api/checkout/logo:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/checkout/payment', async (req, res) => {
//     try {
//         const { paymentDetails } = req.body;

//         // Implement the logic to initiate the payment using the paymentDetails
//         // This may involve making API calls to the payment gateway
//         // and handling the response

//         // Example implementation using Stripe
//         const { amount, currency, customerId, paymentMethodId } = paymentDetails;

//         // Create a payment intent using Stripe API
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency,
//             customer: customerId,
//             payment_method: paymentMethodId,
//             confirm: true,
//         });

//         // Check the payment intent status
//         if (paymentIntent.status === 'succeeded') {
//             // Payment successful
//             res.status(200).json({ success: true });
//         } else {
//             // Payment failed
//             res.status(400).json({ success: false, error: 'Payment failed' });
//         }
//     } catch (error) {
//         console.error('Error in /api/checkout/payment:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

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
