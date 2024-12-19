CREATE TABLE IF NOT EXISTS "test_t3_app_transactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"plaid_account_id" text NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"pending_transaction_id" varchar(255),
	"account_id" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"iso_currency_code" varchar(10),
	"unofficial_currency_code" varchar(10),
	"date" date NOT NULL,
	"authorized_date" date,
	"name" text NOT NULL,
	"merchant_name" text,
	"category" text,
	"pending" boolean DEFAULT false NOT NULL,
	"payment_channel" text,
	"address" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "test_t3_app_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_t3_app_transactions" ADD CONSTRAINT "test_t3_app_transactions_account_id_test_t3_app_account_user_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."test_t3_app_account"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_account_id_idx" ON "test_t3_app_transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_transaction_id_idx" ON "test_t3_app_transactions" USING btree ("transaction_id");