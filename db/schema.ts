import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";
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

// Add relations configuration
export const postsRelations = relations(posts, ({ one }) => ({
  profile: one(profiles, {
    fields: [posts.userId],
    references: [profiles.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  posts: many(posts),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
