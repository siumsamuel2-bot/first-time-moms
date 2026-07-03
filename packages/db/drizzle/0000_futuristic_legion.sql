DO $$ BEGIN
 CREATE TYPE "delivery_type" AS ENUM('vaginal', 'c_section', 'emergency_c_section');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "escalation_severity" AS ENUM('low', 'medium', 'high', 'critical');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "feeding_method" AS ENUM('breast', 'bottle', 'both');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_check_ins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"check_in_date" date NOT NULL,
	"responses" jsonb NOT NULL,
	"escalation_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "escalations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"triggered_at" timestamp DEFAULT now() NOT NULL,
	"severity" "escalation_severity" NOT NULL,
	"symptoms" text[],
	"triage_result" jsonb,
	"clinician_reviewed_at" timestamp,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"specialty" text NOT NULL,
	"accepting_new_patients" text DEFAULT 'true' NOT NULL,
	"contract_status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recovery_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"delivery_date" date NOT NULL,
	"delivery_type" "delivery_type" NOT NULL,
	"feeding_method" "feeding_method" NOT NULL,
	"mental_health_baseline" jsonb,
	"complications" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_profile_id_recovery_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "recovery_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalations" ADD CONSTRAINT "escalations_profile_id_recovery_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "recovery_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
