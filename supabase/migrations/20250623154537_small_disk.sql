/*
  # Create exec_sql function for migrations

  1. Functions
    - `exec_sql` - Allows executing arbitrary SQL queries via RPC
  
  2. Security
    - Grant execute permission to service_role
    - Function runs with SECURITY DEFINER to allow DDL operations
*/

CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    EXECUTE sql_query;
END;
$function$;

-- Grant usage to the service_role
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;