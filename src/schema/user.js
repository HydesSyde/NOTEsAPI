import { PgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = PgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  passWord: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
