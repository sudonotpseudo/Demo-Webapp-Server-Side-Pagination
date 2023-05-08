BEGIN;

CREATE TABLE IF NOT EXISTS public.files
(
    id integer NOT NULL DEFAULT nextval('files_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    type character varying(100) COLLATE pg_catalog."default" NOT NULL,
    project_id integer NOT NULL,
    CONSTRAINT files_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.projects
(
    id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    start_date timestamp without time zone NOT NULL,
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.users_assignment
(
    id integer NOT NULL DEFAULT nextval('users_assignment_id_seq'::regclass),
    user_id integer NOT NULL,
    project_id integer NOT NULL,
    CONSTRAINT users_assignment_pkey PRIMARY KEY (id),
    CONSTRAINT users_assignment_user_id_project_id_key UNIQUE (user_id, project_id)
);

ALTER TABLE IF EXISTS public.files
    ADD CONSTRAINT files_project_id_fkey FOREIGN KEY (project_id)
    REFERENCES public.projects (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users_assignment
    ADD CONSTRAINT users_assignment_project_id_fkey FOREIGN KEY (project_id)
    REFERENCES public.projects (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users_assignment
    ADD CONSTRAINT users_assignment_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;