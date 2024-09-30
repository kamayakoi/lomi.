import express from "express";
import Stripe from "stripe";
import path from 'path';
import { fileURLToPath } from 'url';

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

app.use(express.static(path.join(__dirname, "..", "..", "..", "dist")));
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

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "..", "dist", "index.html"));
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
