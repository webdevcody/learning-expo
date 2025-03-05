CREATE TABLE "followers" (
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "followers_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id")
);
--> statement-breakpoint
CREATE INDEX "follower_idx" ON "followers" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "following_idx" ON "followers" USING btree ("following_id");