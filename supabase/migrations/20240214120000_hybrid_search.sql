-- 1. Enable the pg_trgm extension for fuzzy matching (optional but good)
create extension if not exists pg_trgm;

-- 2. Create an index to make text search fast
create index if not exists kb_content_fts_idx on knowledge_base using gin (to_tsvector('english', content));

-- 3. The Hybrid Search Function
create or replace function match_documents_hybrid (
  query_embedding vector(1536),
  query_text text,
  match_threshold float,
  match_count int
) returns table (
  id uuid,
  file_name text,
  content text,
  similarity float
) language plpgsql as $$
begin
  return query
  select
    kb.id,
    kb.file_name,
    kb.content,
    -- THE MAGIC FORMULA:
    -- (Vector Similarity * 1.0) + (Keyword Rank * 0.5)
    -- We weight vector search higher, but keywords give a boost to exact matches.
    (1 - (kb.embedding <=> query_embedding)) + (ts_rank(to_tsvector('english', kb.content), plainto_tsquery('english', query_text)) * 0.5) as similarity
  from
    knowledge_base kb
  where
    -- Filter 1: Must have at least some semantic similarity
    1 - (kb.embedding <=> query_embedding) > match_threshold
    -- Filter 2: OR must contain the keywords (optional, but keeps results relevant)
    or to_tsvector('english', kb.content) @@ plainto_tsquery('english', query_text)
  order by
    similarity desc
  limit
    match_count;
end;
$$;
