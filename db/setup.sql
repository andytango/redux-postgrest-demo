CREATE SCHEMA IF NOT EXISTS private;

DROP VIEW IF EXISTS public.todos;

DROP TABLE IF EXISTS private.todos;

CREATE TABLE private.todos
(
  todo_id       INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content       TEXT        NOT NULL,
  content_image BYTEA,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW public.todos AS
SELECT todo_id,
       content,
       encode(content_image, 'base64') AS content_image,
       created_at
FROM private.todos;

CREATE OR REPLACE FUNCTION notify_websocket(payload TEXT) RETURNS VOID
  LANGUAGE PLPGSQL AS
$$
BEGIN
  EXECUTE format('NOTIFY websocket, %1$L', concat(payload, E'\n'));
END;
$$;

CREATE OR REPLACE FUNCTION notify_websocket_trigger_table() RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  PERFORM notify_websocket(
    jsonb_build_object('resource', tg_table_name) :: TEXT
    );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS notify_todos ON todos;

CREATE TRIGGER notify_todos
  AFTER
    INSERT
    OR
    UPDATE
    OR
    DELETE
    OR TRUNCATE
  ON private.todos
  FOR EACH STATEMENT
EXECUTE FUNCTION notify_websocket_trigger_table();

CREATE OR REPLACE FUNCTION todos_insert() RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  INSERT INTO private.todos (content, content_image)
  VALUES (new.content,
          decode(new.content_image, 'base64'));

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS todos_insert ON todos;

CREATE TRIGGER todos_insert
  INSTEAD OF
    INSERT
  ON public.todos
  FOR EACH ROW
EXECUTE FUNCTION todos_insert();

CREATE OR REPLACE FUNCTION todos_update() RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  UPDATE private.todos
  SET content       = new.content,
      content_image = decode(new.content_image, 'base64')
  WHERE todo_id = new.todo_id;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS todos_update ON todos;

CREATE TRIGGER todos_update
  INSTEAD OF
    UPDATE
  ON public.todos
  FOR EACH ROW
EXECUTE FUNCTION todos_update();

