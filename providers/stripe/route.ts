import express from 'express';
import { getProvider } from '../../providers';

const router = express.Router();
const stripeProvider = getProvider('stripe');

router.post("/account_session", async (req, res) => {
  try {
    const { account } = req.body;
    const accountSession = await stripeProvider.createAccountSession(account);
    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    console.error("Error creating account session:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/account", async (req, res) => {
  try {
    const account = await stripeProvider.createConnectedAccount(req.body);
    res.json({
      account: account.id,
    });
  } catch (error) {
    console.error("Error creating connected account:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;