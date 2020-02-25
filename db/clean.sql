DO LANGUAGE PLPGSQL $$
DECLARE 
r RECORD;
BEGIN

FOR r IN (
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
) LOOP
  EXECUTE format('TRUNCATE TABLE %1$I', r.table_name);
END LOOP;

END;
$$;