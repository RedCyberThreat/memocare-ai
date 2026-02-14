create extension if not exists "vector" with schema "public";


  create table "public"."knowledge_base" (
    "id" uuid not null default gen_random_uuid(),
    "file_name" text not null,
    "content" text not null,
    "embedding" public.vector(1536)
      );


CREATE UNIQUE INDEX knowledge_base_pkey ON public.knowledge_base USING btree (id);

alter table "public"."knowledge_base" add constraint "knowledge_base_pkey" PRIMARY KEY using index "knowledge_base_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding public.vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id uuid, file_name text, content text, similarity double precision)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT
    knowledge_base.id,
    knowledge_base.file_name,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
$function$
;

grant delete on table "public"."knowledge_base" to "anon";

grant insert on table "public"."knowledge_base" to "anon";

grant references on table "public"."knowledge_base" to "anon";

grant select on table "public"."knowledge_base" to "anon";

grant trigger on table "public"."knowledge_base" to "anon";

grant truncate on table "public"."knowledge_base" to "anon";

grant update on table "public"."knowledge_base" to "anon";

grant delete on table "public"."knowledge_base" to "authenticated";

grant insert on table "public"."knowledge_base" to "authenticated";

grant references on table "public"."knowledge_base" to "authenticated";

grant select on table "public"."knowledge_base" to "authenticated";

grant trigger on table "public"."knowledge_base" to "authenticated";

grant truncate on table "public"."knowledge_base" to "authenticated";

grant update on table "public"."knowledge_base" to "authenticated";

grant delete on table "public"."knowledge_base" to "service_role";

grant insert on table "public"."knowledge_base" to "service_role";

grant references on table "public"."knowledge_base" to "service_role";

grant select on table "public"."knowledge_base" to "service_role";

grant trigger on table "public"."knowledge_base" to "service_role";

grant truncate on table "public"."knowledge_base" to "service_role";

grant update on table "public"."knowledge_base" to "service_role";


