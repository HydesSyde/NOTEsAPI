import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 50 }).notNull(),
  body: varchar("body", { length: 1000 }).notNull(),
  summary: varchar("suummary").notNull(),
  tags: varchar("tags").notNull(),
});
