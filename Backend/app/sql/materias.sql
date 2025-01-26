CREATE SCHEMA IF NOT EXISTS materias;

-- Eliminar tablas si ya existen
DROP TABLE IF EXISTS materias.Contenido CASCADE;
DROP TABLE IF EXISTS materias.Unidad CASCADE;
DROP TABLE IF EXISTS materias.Materia CASCADE;


-- Crear la tabla de Materias
CREATE TABLE materias.materia (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

-- Crear la tabla de Unidades
CREATE TABLE materias.unidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    id_materia INT NOT NULL,
    FOREIGN KEY (id_materia) REFERENCES materias.materia(id) ON DELETE CASCADE
);

-- Crear la tabla de Contenidos
CREATE TABLE materias.contenido (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    id_unidad INT NOT NULL,
    FOREIGN KEY (id_unidad) REFERENCES materias.unidad(id) ON DELETE CASCADE
);

INSERT INTO materias.materia  (nombre, descripcion)
VALUES ('Formulación y Evaluación de Proyectos', 'Descripción de la formulación y evaluación de proyectos');
