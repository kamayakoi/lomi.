const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Client Management
app.post('/clients', async (req, res) => {
  try {
    const { name, email } = req.body;
    // Create a new client using the client model
    const newClient = await createClient(name, email);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/clients/:clientId', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    // Retrieve the client by ID using the client model
    const client = await getClientById(clientId);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error('Error retrieving client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/clients/:clientId', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const { name, email } = req.body;
    // Update the client using the client model
    const updatedClient = await updateClient(clientId, name, email);
    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment Processing
app.post('/payments', async (req, res) => {
  try {
    const { clientId, amount, currency, paymentMethod, endCustomerDetails } = req.body;
    // Process the payment using the payment model
    const payment = await processPayment(clientId, amount, currency, paymentMethod, endCustomerDetails);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/payments/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    // Retrieve the payment by transaction ID using the payment model
    const payment = await getPaymentByTransactionId(transactionId);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error retrieving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction Management
app.get('/transactions', async (req, res) => {
  try {
    // Retrieve all transactions using the transaction model
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/refunds', async (req, res) => {
  try {
    const { transactionId, amount } = req.body;
    // Process the refund using the refund model
    const refund = await processRefund(transactionId, amount);
    res.status(201).json(refund);
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Key Management
app.post('/api-keys', async (req, res) => {
  try {
    const { user_id, name, key, permissions, expires_at } = req.body;
    // Create a new API key using the API key model
    const newApiKey = await createApiKey(user_id, name, key, permissions, expires_at);
    res.status(201).json(newApiKey);
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api-keys/:apiKeyId', async (req, res) => {
  try {
    const apiKeyId = parseInt(req.params.apiKeyId);
    // Retrieve the API key by ID using the API key model
    const apiKey = await getApiKeyById(apiKeyId);
    if (apiKey) {
      res.json(apiKey);
    } else {
      res.status(404).json({ error: 'API key not found' });
    }
  } catch (error) {
    console.error('Error retrieving API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api-keys/:apiKeyId', async (req, res) => {
  try {
    const apiKeyId = parseInt(req.params.apiKeyId);
    const { name, permissions, expires_at } = req.body;
    // Update the API key using the API key model
    const updatedApiKey = await updateApiKey(apiKeyId, name, permissions, expires_at);
    if (updatedApiKey) {
      res.json(updatedApiKey);
    } else {
      res.status(404).json({ error: 'API key not found' });
    }
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Provider Management
app.post('/api-providers', async (req, res) => {
  try {
    const { name, description, base_url } = req.body;
    // Create a new API provider using the API provider model
    const newApiProvider = await createApiProvider(name, description, base_url);
    res.status(201).json(newApiProvider);
  } catch (error) {
    console.error('Error creating API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api-providers/:apiProviderId', async (req, res) => {
  try {
    const apiProviderId = parseInt(req.params.apiProviderId);
    // Retrieve the API provider by ID using the API provider model
    const apiProvider = await getApiProviderById(apiProviderId);
    if (apiProvider) {
      res.json(apiProvider);
    } else {
      res.status(404).json({ error: 'API provider not found' });
    }
  } catch (error) {
    console.error('Error retrieving API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api-providers/:apiProviderId', async (req, res) => {
  try {
    const apiProviderId = parseInt(req.params.apiProviderId);
    const { name, description, base_url } = req.body;
    // Update the API provider using the API provider model
    const updatedApiProvider = await updateApiProvider(apiProviderId, name, description, base_url);
    if (updatedApiProvider) {
      res.json(updatedApiProvider);
    } else {
      res.status(404).json({ error: 'API provider not found' });
    }
  } catch (error) {
    console.error('Error updating API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Credential Management
app.post('/api-credentials', async (req, res) => {
  try {
    const { provider_id, name, api_key, api_secret } = req.body;
    // Create a new API credential using the API credential model
    const newApiCredential = await createApiCredential(provider_id, name, api_key, api_secret);
    res.status(201).json(newApiCredential);
  } catch (error) {
    console.error('Error creating API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api-credentials/:apiCredentialId', async (req, res) => {
  try {
    const apiCredentialId = parseInt(req.params.apiCredentialId);
    // Retrieve the API credential by ID using the API credential model
    const apiCredential = await getApiCredentialById(apiCredentialId);
    if (apiCredential) {
      res.json(apiCredential);
    } else {
      res.status(404).json({ error: 'API credential not found' });
    }
  } catch (error) {
    console.error('Error retrieving API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api-credentials/:apiCredentialId', async (req, res) => {
  try {
    const apiCredentialId = parseInt(req.params.apiCredentialId);
    const { name, api_key, api_secret } = req.body;
    // Update the API credential using the API credential model
    const updatedApiCredential = await updateApiCredential(apiCredentialId, name, api_key, api_secret);
    if (updatedApiCredential) {
      res.json(updatedApiCredential);
    } else {
      res.status(404).json({ error: 'API credential not found' });
    }
  } catch (error) {
    console.error('Error updating API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment Method Management
app.post('/payment-methods', async (req, res) => {
  try {
    const { name, description, provider_id } = req.body;
    // Create a new payment method using the payment method model
    const newPaymentMethod = await createPaymentMethod(name, description, provider_id);
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/payment-methods/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = parseInt(req.params.paymentMethodId);
    // Retrieve the payment method by ID using the payment method model
    const paymentMethod = await getPaymentMethodById(paymentMethodId);
    if (paymentMethod) {
      res.json(paymentMethod);
    } else {
      res.status(404).json({ error: 'Payment method not found' });
    }
  } catch (error) {
    console.error('Error retrieving payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/payment-methods/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = parseInt(req.params.paymentMethodId);
    const { name, description, provider_id } = req.body;
    // Update the payment method using the payment method model
    const updatedPaymentMethod = await updatePaymentMethod(paymentMethodId, name, description, provider_id);
    if (updatedPaymentMethod) {
      res.json(updatedPaymentMethod);
    } else {
      res.status(404).json({ error: 'Payment method not found' });
    }
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});