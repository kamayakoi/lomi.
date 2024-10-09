CREATE OR REPLACE FUNCTION public.send_onboarding_notifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert combined welcome and onboarding notification
    INSERT INTO notifications (merchant_id, type, message, is_read)
    VALUES (
        NEW.merchant_id,
        'onboarding'::notification_type,
        'Welcome to lomi., ' || split_part(NEW.name, ' ', 1) || '! We''re excited to have you on board. To get started, please activate your profile and set up your account settings.',
        false
    );

    -- Schedule the dark mode tip notification
    INSERT INTO notifications (merchant_id, type, message, is_read)
    VALUES (
        NEW.merchant_id,
        'tip'::notification_type,
        'You can switch to dark mode by clicking on your organization logo at the bottom left of the portal.',
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

-- Function to mark all notifications as read for a specific merchant
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_merchant_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET is_read = true
    WHERE merchant_id = p_merchant_id AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark a specific notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET is_read = true
    WHERE notification_id = p_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read(UUID) TO authenticated;