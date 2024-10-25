import { Router } from 'express';
import { supabase } from '@/utils/supabase/client';

const router = Router();

router.post('/', async (req, res) => {
  const { name, expirationDate } = req.body;
  const merchantId = req.user.id;
  const organizationId = req.user.organizationId;

  try {
    const { data, error } = await supabase.rpc('generate_api_key', {
      p_merchant_id: merchantId,
      p_organization_id: organizationId,
      p_name: name,
      p_expiration_date: expirationDate ? expirationDate : null,
    });

    if (error) {
      console.error('Error generating API key:', error);
      res.status(500).json({ error: 'An error occurred while generating the API key' });
    } else if (data && data[0] && data[0].api_key) {
      res.status(201).json({ apiKey: data[0].api_key });
    } else {
      res.status(500).json({ error: 'No data returned from API key generation' });
    }
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ error: 'An error occurred while generating the API key' });
  }
});

// Other API key-related endpoints...

export default router;
