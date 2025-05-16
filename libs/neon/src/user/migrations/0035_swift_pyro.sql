-- Custom SQL migration file, put you code below! --
INSERT INTO users_gems (user_id, gems) SELECT id AS user_id, 0 AS gems FROM users ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO users_streak (user_id, streak) SELECT id AS user_id, 0 AS streak FROM users ON CONFLICT DO NOTHING;--> statement-breakpoint