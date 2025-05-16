DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'experiences' AND column_name = 'is_pinned'
    ) THEN
        ALTER TABLE "experiences" ADD COLUMN "is_pinned" boolean;
    END IF;
END $$;