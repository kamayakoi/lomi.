
-- Create a trigger to update installment plan status
CREATE OR REPLACE FUNCTION update_installment_plan_status() RETURNS TRIGGER AS $$
DECLARE
    pending_count INT;
    completed_count INT;
    failed_count INT;
    total_count INT;
BEGIN
    -- Count statuses
    SELECT 
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'failed'),
        COUNT(*)
    INTO 
        pending_count, completed_count, failed_count, total_count
    FROM 
        installment_payments 
    WHERE 
        plan_id = NEW.plan_id;

    -- Update plan status
    IF total_count = completed_count THEN
        -- All installments completed
        UPDATE installment_plans SET status = 'completed', updated_at = NOW() WHERE plan_id = NEW.plan_id;
    ELSIF failed_count > 0 THEN
        -- At least one installment failed - plan is in trouble
        UPDATE installment_plans SET status = 'failed', updated_at = NOW() WHERE plan_id = NEW.plan_id;
    ELSE
        -- Mixed status, keep as pending
        UPDATE installment_plans SET status = 'pending', updated_at = NOW() WHERE plan_id = NEW.plan_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 

CREATE TRIGGER update_installment_plan_status
AFTER INSERT OR UPDATE ON installment_payments
FOR EACH ROW EXECUTE FUNCTION update_installment_plan_status();