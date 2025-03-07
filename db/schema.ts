import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export type NotificationType = "like" | "follow" | "unfollow" | "post";

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    content: text("content").notNull(),
    imageKey: text("image_key"),
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

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    actorId: text("actor_id").notNull(),
    type: text("type").$type<NotificationType>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    actorIdIdx: index("notifications_actor_id_idx").on(table.actorId),
  })
);

export const likes = pgTable(
  "likes",
  {
    userId: text("user_id").notNull(),
    postId: serial("post_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.postId] }),
    userIdIdx: index("likes_user_id_idx").on(table.userId),
    postIdIdx: index("likes_post_id_idx").on(table.postId),
  })
);

// Add relations configuration
export const postsRelations = relations(posts, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [posts.userId],
    references: [profiles.userId],
  }),
  likes: many(likes),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  posts: many(posts),
  followers: many(followers, {
    relationName: "followers",
  }),
  following: many(followers, {
    relationName: "following",
  }),
  notifications: many(notifications, {
    relationName: "notifications",
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.userId],
  }),
  actor: one(profiles, {
    fields: [notifications.actorId],
    references: [profiles.userId],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(profiles, {
    fields: [likes.userId],
    references: [profiles.userId],
  }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Follower = typeof followers.$inferSelect;
export type NewFollower = typeof followers.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
