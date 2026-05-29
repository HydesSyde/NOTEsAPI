ALTER TABLE "notes" ALTER COLUMN "tags" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "tags" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "summary" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "suummary";