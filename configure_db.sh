#!/usr/bin/env bash

psql postgres://postgres:secret@localhost:5432/postgres -c '
CREATE TABLE IF NOT EXISTS public.todos (
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
 -c '
CREATE OR REPLACE FUNCTION public.trigger_notify_table()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $fn$
BEGIN
  EXECUTE format(
    $sql$NOTIFY websocket, %1$L;$sql$,
    concat(
      jsonb_build_object($$resource$$, TG_TABLE_NAME) :: TEXT,
      chr(10)
    )
  );
  RAISE NOTICE $$%$$, format(
    $sql$NOTIFY websocket, %1$L;$sql$,
    concat(
      jsonb_build_object($$resource$$, TG_TABLE_NAME) :: TEXT,
      chr(10)
    )
  );
  RETURN NEW;
END;
$fn$;
' -c '
CREATE TRIGGER IF NOT EXISTS todos_notify
AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON public.todos
FOR EACH STATEMENT
EXECUTE FUNCTION public.trigger_notify_table();
'