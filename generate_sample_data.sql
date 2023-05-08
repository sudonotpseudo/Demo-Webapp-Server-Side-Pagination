-- Start by removing all existing data from tables
BEGIN;

-- Delete all existing data from tables
TRUNCATE TABLE public.files CASCADE;
TRUNCATE TABLE public.projects CASCADE;
TRUNCATE TABLE public.users CASCADE;
TRUNCATE TABLE public.users_assignment CASCADE;

-- Reset sequence for all tables to start at 1
ALTER SEQUENCE public.files_id_seq RESTART WITH 1;
ALTER SEQUENCE public.projects_id_seq RESTART WITH 1;
ALTER SEQUENCE public.users_id_seq RESTART WITH 1;
ALTER SEQUENCE public.users_assignment_id_seq RESTART WITH 1;


-- Generate sample data for projects table
INSERT INTO public.projects (name, start_date)
SELECT
  'Project ' || id AS name,
  now() - (floor(random() * 365) || ' days')::interval AS start_date
FROM generate_series(1, 10) id;

-- Generate sample data for the users table
INSERT INTO public.users (name, email)
SELECT
  'User ' || id AS name,
  'user' || id || '@company.com' AS email
FROM generate_series(1, 20) id;

-- Generate sample data for the files table
INSERT INTO 
	files 
	(
		name,
		type,
		project_id
	)

SELECT DISTINCT ON (id) 
name, type, project_id
FROM(
SELECT
  f.id AS id,
  f.name AS name,
  f.type AS type,
  t.id as project_id
FROM (
  SELECT 
    id, 
    'File ' || id AS name, 
    CASE 
      WHEN random() < 0.25 THEN 'PDF'
      WHEN random() < 0.5 THEN 'DOC'
      WHEN random() < 0.75 THEN 'PNG'
      ELSE 'TXT'
    END AS type
  FROM generate_series(1, 100) id
) f
CROSS JOIN LATERAL 
(SELECT id, f.id as x FROM projects ORDER BY random() LIMIT (3+random()*4)) t
) as p;

-- Generate sample data for the users_assigment table
INSERT INTO 
	users_assignment 
	(
		user_id, 
		project_id
	)
SELECT 
	users.id as user_id, 
	t.id as project_id 
FROM 
	users
CROSS JOIN LATERAL 
(SELECT id, users.id as x FROM projects ORDER BY random() LIMIT (3+random()*4)) t
;

END;