CREATE TABLE IF NOT EXISTS todos (
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION notify_websocket(payload TEXT)
RETURNS VOID
LANGUAGE PLPGSQL
AS $$
BEGIN
  EXECUTE FORMAT('NOTIFY websocket, %1$L', concat(payload, E'\n'));
END;
$$;

CREATE OR REPLACE FUNCTION notify_websocket_trigger_table()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  PERFORM notify_websocket(
    jsonb_build_object('resource', TG_TABLE_NAME) :: TEXT
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_todos ON todos;

CREATE TRIGGER notify_todos
AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
ON todos
FOR EACH STATEMENT
EXECUTE FUNCTION notify_websocket_trigger_table();