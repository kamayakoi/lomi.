import express from 'express';
import organizationsRouter from './routes/organizations';
import organizationProvidersRouter from './routes/organizationProviders';
import userOrganizationLinksRouter from './routes/userOrganizationLinks';
import transactionsRouter from './routes/transactions';
import endCustomersRouter from './routes/endCustomers';
import providersRouter from './routes/providers';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/organizations', organizationsRouter);
app.use('/organization-providers', organizationProvidersRouter);
app.use('/user-organization-links', userOrganizationLinksRouter);
app.use('/transactions', transactionsRouter);
app.use('/end-customers', endCustomersRouter);
app.use('/providers', providersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;