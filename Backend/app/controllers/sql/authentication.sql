CREATE SCHEMA IF NOT EXISTS authentication;

-- Eliminar tablas si ya existen
DROP TABLE IF EXISTS authentication.sesiones CASCADE;
DROP TABLE IF EXISTS authentication.user CASCADE;
DROP TABLE IF EXISTS authentication.type_user CASCADE;
DROP TABLE IF EXISTS authentication.sesiones CASCADE;
DROP TABLE IF EXISTS authentication.api_tokens CASCADE;

-- Crear la tabla type_user
CREATE TABLE authentication.type_user (
    id SERIAL PRIMARY KEY, -- Clave primaria
    type VARCHAR(255) NOT NULL UNIQUE -- Tipo de usuario único
);

-- Crear la tabla user
CREATE TABLE authentication.user (
    id SERIAL PRIMARY KEY, -- Clave primaria basada en el ID
    email VARCHAR(255) NOT NULL UNIQUE, -- Email único
    name VARCHAR(100), -- Nombre
    surname VARCHAR(100), -- Apellido
    phone VARCHAR(20), -- Teléfono único
    status_logico BOOLEAN DEFAULT TRUE NOT NULL, -- Estado lógico por defecto
    type_id INT NOT NULL, -- Clave foránea al tipo de usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de actualización
    FOREIGN KEY (type_id) REFERENCES authentication.type_user (id) ON DELETE CASCADE -- Relación con type_user
);

-- Crear la tabla sesiones
CREATE TABLE authentication.sesiones (
    id SERIAL PRIMARY KEY, -- Clave primaria
    user_id INT NOT NULL, -- Clave foránea al ID del usuario
    password VARCHAR(255) NOT NULL, -- Contraseña para la sesión
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la sesión
    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE -- Relación con user
);

CREATE TABLE authentication.api_tokens (
    id SERIAL PRIMARY KEY,                     -- Identificador único
    user_id INT NOT NULL,                      -- Clave foránea al ID del usuario
    type_id INT NOT NULL,                      -- tipo de usuario
    token VARCHAR(64) NOT NULL UNIQUE,         -- Token único
    expires_at TIMESTAMP WITH TIME ZONE,       -- Fecha de expiración
    created_at TIMESTAMP DEFAULT NOW(),        -- Fecha de creación

    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE
);

-- Insertar datos en type_user
INSERT INTO authentication.type_user (type)
VALUES 
    ('estudiante'),
    ('profesor');


----------------------------------------------------------------------------
-- crear un usuario
{
    "email": "root",
    "password": "1234",
    "type_id": 2
}



