


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."caregiver_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid",
    "user_message" "text" NOT NULL,
    "ai_response" "text" NOT NULL,
    "stress_level" integer,
    "sentiment" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "caregiver_logs_stress_level_check" CHECK ((("stress_level" >= 1) AND ("stress_level" <= 10)))
);


ALTER TABLE "public"."caregiver_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "phone_number" "text" NOT NULL,
    "preferred_language" "text" DEFAULT 'en'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."caregiver_logs"
    ADD CONSTRAINT "caregiver_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_phone_number_key" UNIQUE ("phone_number");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "update_conversations_updated_at" BEFORE UPDATE ON "public"."conversations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."caregiver_logs"
    ADD CONSTRAINT "caregiver_logs_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."caregiver_logs" TO "anon";
GRANT ALL ON TABLE "public"."caregiver_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."caregiver_logs" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


