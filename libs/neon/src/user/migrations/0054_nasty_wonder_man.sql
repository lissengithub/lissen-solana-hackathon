ALTER TABLE "access_type_concert" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "access_type_concert" ADD PRIMARY KEY ("access_id");--> statement-breakpoint
INSERT INTO accesses SELECT created_at, updated_at, id, artist_id, ext_link, default_price, ticket_amount, type, image, boost, is_pinned, FALSE AS is_bonus_only FROM experiences WHERE type != 'bonus';--> statement-breakpoint
INSERT INTO accesses SELECT created_at, updated_at, id, artist_id, ext_link, default_price, ticket_amount, 'merch' AS type, image, boost, is_pinned, TRUE AS is_bonus_only FROM experiences WHERE type = 'bonus';--> statement-breakpoint
INSERT INTO access_type_concert SELECT created_at, updated_at, id AS access_id, date_time, event_info ->> 'city' AS city, event_info ->> 'venue' AS venue, instructions, instructions_image FROM experiences WHERE type = 'concert';--> statement-breakpoint
INSERT INTO access_bonus_giveaways SELECT gen_random_uuid() AS id, a.created_at, a.updated_at, a.id AS access_id, b.gem_cost, a.created_at AS start_date, 1 AS reward_count_per_winner, 1 AS number_of_winners, a.raffle_draw_date_time AS raffle_date, a.raffle_drawn AS raffle_has_drawn FROM experiences a RIGHT JOIN access_vouchers b ON b.access_id = a.id WHERE a.type = 'bonus';
DELETE FROM access_vouchers WHERE reward_type = 'raffle_entry';--> statement-breakpoint
UPDATE access_vouchers SET reward_type = 'access' WHERE reward_type = 'ticket';--> statement-breakpoint
DELETE FROM access_bonus_giveaway_tickets WHERE access_id NOT IN (SELECT access_id FROM access_bonus_giveaways);--> statement-breakpoint
UPDATE inboxes SET type = 'access' WHERE type = 'experience';--> statement-breakpoint
UPDATE inboxes SET resource_type = 'bonus_giveaway' WHERE resource_type = 'bonus';--> statement-breakpoint