CREATE OR REPLACE FUNCTION public.send_onboarding_notifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert combined welcome and onboarding notification
    INSERT INTO notifications (merchant_id, type, message, is_read)
    VALUES (
        NEW.merchant_id,
        'onboarding'::notification_type,
        'Welcome to lomi., ' || NEW.name || '! We''re excited to have you on board. To get started, please activate your profile and set up your account settings and payment methods.',
        false
    );

    -- Schedule the dark mode tip notification to be sent after 2 days
    INSERT INTO notifications (merchant_id, type, message, created_at, is_read)
    VALUES (
        NEW.merchant_id,
        'tip'::notification_type,
        'Did you know? You can switch to dark mode by clicking on your organization logo at the bottom left of the portal.',
        NOW() + INTERVAL '2 days',
        false
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function after inserting a new merchant
CREATE TRIGGER send_onboarding_notifications_trigger
AFTER INSERT ON merchants
FOR EACH ROW
EXECUTE FUNCTION public.send_onboarding_notifications();