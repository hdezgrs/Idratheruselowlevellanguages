CREATE DATABASE propositos
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Mexico.1252'
    LC_CTYPE = 'Spanish_Mexico.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


CREATE TABLE IF NOT EXISTS MisPropositos(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion TEXT
);

INSERT INTO MisPropositos(nombre, descripcion)
VALUES
('Test', '1'),
('test3', '4'),
('test4','5'),
('test5', '6');

SELECT * FROM MisPropositos;

DELETE FROM MisPropositos WHERE id != 1;