import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

export const profiles = pgTable(
  "profiles",
  {
    userId: text("user_id").primaryKey(),
    displayName: text("display_name").notNull(),
    handle: text("handle").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_index").on(table.userId),
  })
);

export const followers = pgTable(
  "followers",
  {
    followerId: text("follower_id").notNull(),
    followingId: text("following_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
    followerIdx: index("follower_idx").on(table.followerId),
    followingIdx: index("following_idx").on(table.followingId),
  })
);

// Add relations configuration
export const postsRelations = relations(posts, ({ one }) => ({
  profile: one(profiles, {
    fields: [posts.userId],
    references: [profiles.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  posts: many(posts),
  followers: many(followers, {
    relationName: "followers",
  }),
  following: many(followers, {
    relationName: "following",
  }),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(profiles, {
    fields: [followers.followerId],
    references: [profiles.userId],
    relationName: "following",
  }),
  following: one(profiles, {
    fields: [followers.followingId],
    references: [profiles.userId],
    relationName: "followers",
  }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Follower = typeof followers.$inferSelect;
export type NewFollower = typeof followers.$inferInsert;
