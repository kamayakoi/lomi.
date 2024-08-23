ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own webhooks" ON webhooks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks" ON webhooks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks" ON webhooks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks" ON webhooks
  FOR DELETE USING (auth.uid() = user_id);