ALTER TABLE "posts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "posts" USING btree ("user_id");