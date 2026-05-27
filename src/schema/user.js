import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  passWord: text("password").notNull(),
  role: text("role").notNull(),
  refreshToken: text("refresh_token").default(""),
  resetToken: text("reset_token").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
