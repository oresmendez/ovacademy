-------------------------  authentication

CREATE SCHEMA IF NOT EXISTS authentication;

DROP TABLE IF EXISTS authentication.type_user CASCADE;
CREATE TABLE authentication.type_user (
    id SERIAL PRIMARY KEY, -- Clave primaria
    type VARCHAR(255) NOT NULL UNIQUE -- Tipo de usuario único
);INSERT INTO authentication.type_user (type) VALUES ('estudiante'), ('profesor'), ('administrador');

DROP TABLE IF EXISTS authentication.user CASCADE;
CREATE TABLE authentication.user (
    id SERIAL PRIMARY KEY, -- Clave primaria basada en el ID
    email VARCHAR(255) NOT NULL UNIQUE, -- Email único
    name VARCHAR(100), -- Nombre
    surname VARCHAR(100), -- Apellido
    phone VARCHAR(20), -- Teléfono único
    type_id INT NOT NULL, -- Clave foránea al tipo de usuario
    status_logico BOOLEAN NOT NULL, -- Estado lógico por defecto
    eliminado BOOLEAN DEFAULT FALSE NOT NULL, -- Estado lógico por defecto
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de actualización
    FOREIGN KEY (type_id) REFERENCES authentication.type_user (id) ON DELETE CASCADE -- Relación con type_user
);

DROP TABLE IF EXISTS authentication.sesiones CASCADE;
CREATE TABLE authentication.sesiones (
    id SERIAL PRIMARY KEY, -- Clave primaria
    user_id INT NOT NULL, -- Clave foránea al ID del usuario
    password VARCHAR(255) NOT NULL, -- Contraseña para la sesión
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la sesión
    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE -- Relación con user
);

DROP TABLE IF EXISTS authentication.token CASCADE;
CREATE TABLE authentication.token (
    id SERIAL PRIMARY KEY,                     -- Identificador único
    user_id INT NOT NULL,                      -- Clave foránea al ID del usuario
    type_id INT NOT NULL,                      -- tipo de usuario
    token VARCHAR(64) NOT NULL UNIQUE,         -- Token único
    expires_at TIMESTAMP WITH TIME ZONE,       -- Fecha de expiración
    created_at TIMESTAMP DEFAULT NOW(),        -- Fecha de creación

    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE
);

-------------------------  universidad

CREATE SCHEMA IF NOT EXISTS universidad;

DROP TABLE IF EXISTS universidad.type_aprobacion_estudiante CASCADE;
CREATE TABLE universidad.type_aprobacion_estudiante (
    id SERIAL PRIMARY KEY, 
    type VARCHAR(20) NOT NULL
); INSERT INTO universidad.type_aprobacion_estudiante (type) VALUES ('En curso'),('Aprobado'),('Reprobado');

DROP TABLE IF EXISTS universidad.estudiante CASCADE;
CREATE TABLE universidad.estudiante (
     
    user_id INT PRIMARY KEY, 
    habilitado BOOLEAN DEFAULT FALSE NOT NULL,
    id_probacion_estudiante INT DEFAULT 1 NOT NULL,

    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE,
    FOREIGN KEY (id_probacion_estudiante) REFERENCES universidad.type_aprobacion_estudiante (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.profesor CASCADE;
CREATE TABLE universidad.profesor (
     
    user_id INT PRIMARY KEY, 
    habilitado BOOLEAN DEFAULT FALSE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE 
);

DROP TABLE IF EXISTS universidad.administrador CASCADE;
CREATE TABLE universidad.administrador (
     
    user_id INT PRIMARY KEY, 
    habilitado BOOLEAN DEFAULT FALSE NOT NULL, 

    FOREIGN KEY (user_id) REFERENCES authentication.user (id) ON DELETE CASCADE 
);

DROP TABLE IF EXISTS universidad.semestre CASCADE;
CREATE TABLE universidad.semestre (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    date_start DATE NOT NULL, 
    date_end DATE,
    active BOOLEAN DEFAULT TRUE NOT NULL 
);

DROP TABLE IF EXISTS universidad.aula CASCADE;
CREATE TABLE universidad.aula (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    ubicacion VARCHAR(50),
    active BOOLEAN DEFAULT TRUE NOT NULL 
);

DROP TABLE IF EXISTS universidad.semestre_profesor_aula CASCADE;
CREATE TABLE universidad.semestre_profesor_aula (
    id SERIAL PRIMARY KEY,
    profesor_id INT NOT NULL,
    aula_id INT NOT NULL,
    semestre_id INT NOT NULL,
    habilitado BOOLEAN DEFAULT TRUE NOT NULL,

    FOREIGN KEY (semestre_id) REFERENCES universidad.semestre (id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES universidad.profesor (user_id) ON DELETE CASCADE,
    FOREIGN KEY (aula_id) REFERENCES universidad.aula (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.estudiante_aula CASCADE;
CREATE TABLE universidad.estudiante_aula (
    semestre_profesor_aula_id INT NOT NULL,
    semestre_id INT NOT NULL,  
    estudiante_id INT NOT NULL,
    nota_final DECIMAL DEFAULT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (semestre_id, estudiante_id),
    
    FOREIGN KEY (semestre_profesor_aula_id) REFERENCES universidad.semestre_profesor_aula (id) ON DELETE CASCADE,
    FOREIGN KEY (semestre_id) REFERENCES universidad.semestre (id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES universidad.estudiante (user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.materia CASCADE;
CREATE TABLE universidad.materia (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    objetivo TEXT,
    descripcion TEXT
); INSERT INTO universidad.materia (nombre, objetivo, descripcion) VALUES (
    'Formulación y evaluación de proyectos de inversión (230-4604)',
    'Crear profesionales que tengan habilidades para el desarrollo de micro-empresas', 
    'La formulación y evaluación de proyectos es el proceso sistemático de diseñar, analizar y valorar la viabilidad técnica, económica y financiera de una idea antes de su ejecución. Su objetivo es determinar si un proyecto es rentable y factible, minimizando riesgos y optimizando recursos');

DROP TABLE IF EXISTS universidad.unidades CASCADE;
CREATE TABLE universidad.unidades (
    id SERIAL PRIMARY KEY,
    profesor_id INT NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    nota_unidad DECIMAL DEFAULT 0,
    status BOOLEAN DEFAULT TRUE NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL, 
    deleted_at TIMESTAMP DEFAULT NULL,

    FOREIGN KEY (profesor_id) REFERENCES universidad.profesor (user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.contenidos CASCADE;
CREATE TABLE universidad.contenidos (
    id SERIAL PRIMARY KEY,
    id_unidad INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL, 
    deleted_at TIMESTAMP DEFAULT NULL,

    FOREIGN KEY (id_unidad) REFERENCES universidad.unidades (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.type_evaluaciones CASCADE;
CREATE TABLE universidad.type_evaluaciones (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL UNIQUE
);INSERT INTO universidad.type_evaluaciones (type) VALUES ('Sopa de Letras'), ('Cuestionarios'), ('Preguntas Abiertas');

DROP TABLE IF EXISTS universidad.evaluaciones CASCADE;
CREATE TABLE universidad.evaluaciones (
    id SERIAL PRIMARY KEY,
    id_unidad INT NOT NULL,
    type_id INT NOT NULL,
    nota_evaluacion DECIMAL DEFAULT 0,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL, 
    deleted_at TIMESTAMP DEFAULT NULL,

    FOREIGN KEY (type_id) REFERENCES universidad.type_evaluaciones (id) ON DELETE CASCADE, 
    FOREIGN KEY (id_unidad) REFERENCES universidad.unidades (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.notas_estudiante CASCADE;
CREATE TABLE universidad.notas_estudiante (

    nota_evaluacion DECIMAL DEFAULT 0,
    estudiante_id INT NOT NULL,
    evaluacion_id INT NOT NULL ,
    semestre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    
    PRIMARY KEY (estudiante_id, evaluacion_id, semestre_id),

    FOREIGN KEY (estudiante_id) REFERENCES universidad.estudiante (user_id) ON DELETE CASCADE,
    FOREIGN KEY (evaluacion_id) REFERENCES universidad.evaluaciones (id) ON DELETE CASCADE, 
    FOREIGN KEY (semestre_id) REFERENCES universidad.semestre (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.sopa_de_letras CASCADE;
CREATE TABLE universidad.sopa_de_letras (
    id SERIAL PRIMARY KEY,
    evaluacion_id INT NOT NULL,
    palabras TEXT,

    FOREIGN KEY (evaluacion_id) REFERENCES universidad.evaluaciones (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.respuestas_sopa_letras CASCADE;
CREATE TABLE universidad.respuestas_sopa_letras (
    
    estudiante_id INT NOT NULL,
    sopa_id INT NOT NULL,
    semestre_id INT NOT NULL,
    matrix TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (estudiante_id, sopa_id, semestre_id),

    FOREIGN KEY (semestre_id) REFERENCES universidad.semestre (id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES universidad.estudiante (user_id) ON DELETE CASCADE,
    FOREIGN KEY (sopa_id) REFERENCES universidad.sopa_de_letras (id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS universidad.cuestionarios CASCADE;
CREATE TABLE universidad.cuestionarios (
    id SERIAL PRIMARY KEY,
    evaluacion_id INT NOT NULL,
    pregunta TEXT NOT NULL,
    opciones TEXT[],
    respuesta_correcta TEXT NOT NULL,

    FOREIGN KEY (evaluacion_id) REFERENCES universidad.evaluaciones (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.respuestas_cuestionarios CASCADE;
CREATE TABLE universidad.respuestas_cuestionarios (
 
    estudiante_id INT NOT NULL,
    cuestionario_id INT NOT NULL,
    semestre_id INT NOT NULL,
    respuesta TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (estudiante_id, cuestionario_id, semestre_id),

    FOREIGN KEY (semestre_id) REFERENCES universidad.semestre (id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES universidad.estudiante (user_id) ON DELETE CASCADE,
    FOREIGN KEY (cuestionario_id) REFERENCES universidad.cuestionarios (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.preguntas_abiertas CASCADE;
CREATE TABLE universidad.preguntas_abiertas (
    id SERIAL PRIMARY KEY,
    evaluacion_id INT NOT NULL,
    pregunta TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL, 
    deleted_at TIMESTAMP DEFAULT NULL,

    FOREIGN KEY (evaluacion_id) REFERENCES universidad.evaluaciones (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS universidad.type_escala_apreciacion CASCADE;
CREATE TABLE universidad.type_escala_apreciacion (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL UNIQUE
);INSERT INTO universidad.type_escala_apreciacion (type) VALUES ('Buena'), ('Regular'), ('Mala');

DROP TABLE IF EXISTS universidad.respuestas_preguntas_abiertas CASCADE;
CREATE TABLE universidad.respuestas_preguntas_abiertas (
 
    semestre_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    preguntas_abiertas_id INT NOT NULL,
    respuesta TEXT NOT NULL,
    id_escala_apreciacion INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (estudiante_id, preguntas_abiertas_id, semestre_id),

    FOREIGN KEY (semestre_id) REFERENCES universidad.semestre (id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES universidad.estudiante (user_id) ON DELETE CASCADE,
    FOREIGN KEY (preguntas_abiertas_id) REFERENCES universidad.preguntas_abiertas (id) ON DELETE CASCADE,
    FOREIGN KEY (id_escala_apreciacion) REFERENCES universidad.type_escala_apreciacion (id) ON DELETE CASCADE
);