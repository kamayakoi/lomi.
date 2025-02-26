-- Create a trigger to update payment group status based on items
CREATE OR REPLACE FUNCTION update_payment_group_status() RETURNS TRIGGER AS $$
DECLARE
    pending_count INT;
    completed_count INT;
    failed_count INT;
    total_count INT;
    group_total NUMERIC(15,2);
    paid_total NUMERIC(15,2);
BEGIN
    -- Count statuses
    SELECT 
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'failed'),
        COUNT(*),
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)
    INTO 
        pending_count, completed_count, failed_count, total_count, paid_total
    FROM 
        payment_group_items 
    WHERE 
        group_id = NEW.group_id;

    -- Get group total
    SELECT total_amount INTO group_total FROM payment_groups WHERE group_id = NEW.group_id;

    -- Update group status
    IF total_count = completed_count THEN
        -- All items completed
        UPDATE payment_groups SET status = 'completed', updated_at = NOW() WHERE group_id = NEW.group_id;
    ELSIF failed_count = total_count THEN
        -- All items failed
        UPDATE payment_groups SET status = 'failed', updated_at = NOW() WHERE group_id = NEW.group_id;
    ELSIF paid_total >= group_total THEN
        -- Amount paid meets or exceeds required total
        UPDATE payment_groups SET status = 'completed', updated_at = NOW() WHERE group_id = NEW.group_id;
        
        -- If there are pending items, mark them as cancelled
        IF pending_count > 0 THEN
            UPDATE payment_group_items 
            SET status = 'cancelled', updated_at = NOW() 
            WHERE group_id = NEW.group_id AND status = 'pending';
        END IF;
    ELSE
        -- Mixed status, keep as pending
        UPDATE payment_groups SET status = 'pending', updated_at = NOW() WHERE group_id = NEW.group_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 

CREATE TRIGGER update_group_status
AFTER INSERT OR UPDATE ON payment_group_items
FOR EACH ROW EXECUTE FUNCTION update_payment_group_status();