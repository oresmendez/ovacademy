import { DateTime } from 'luxon';
import type { HttpContext } from '@adonisjs/core/http'
import SemestreService from '../../controllers/semestre/service.js'

import SemestreProfesorAulaService from '../../controllers/semestre_profesor_aula/service.js'
const SemestreProfesorAulaService_ = new SemestreProfesorAulaService();

import UsersController from '../users/main.js'
const UsersController_ = new UsersController();

const SemestreService_ = new SemestreService();


export default class SemestreController {

    obtenerSemestreActivo = async () => {
        return await SemestreService_.obtenerSemestreActivo()
    }

    public async create_semestre({ request, response }: HttpContext) {
        try {

            const semestreActivo = await SemestreService_.obtenerSemestreActivo()
           
            if (semestreActivo) {
                return response.status(403).send({ 
                    message: 'Debe finalizar el semestre en curso', 
                    success: false 
                });
            }

            const { nombre, fecha_inicio } = request.only(['nombre', 'fecha_inicio'])

            const fechaInicioParsed = DateTime.fromISO(fecha_inicio);

            if (!fechaInicioParsed.isValid) {
                return response.status(400).send({
                    message: 'La fecha de inicio no es válida',
                    success: false,
                });
            }

            const hoy = DateTime.now().startOf('day');

            if (fechaInicioParsed < hoy) {
                return response.status(400).send({
                    message: 'La fecha de inicio no puede ser anterior a hoy',
                    success: false,
                });
            }
            const semestre = await SemestreService_.crear_semestre(nombre, fecha_inicio)

            if (!semestre) {
                return response.status(400).send({ 
                    message: 'Error al crear el semestre', 
                    success: false 
                });
            }

            return response.status(200).json({
                message: 'semestre creado'
            });
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async get_Semestres({ response }: HttpContext) {

        try {
            
            const semestres = await SemestreService_.obtenerSemestres();
            if (!semestres) {
                return response.status(400).send({ 
                    message: 'Error al obtener los semestres', 
                    success: false 
                });
            }
    
            return response.status(200).json({
                message: 'listado de semestres',
                data: semestres
            });
         
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async get_SemestreActivo({ response }: HttpContext) {

        try {

            const semestreActivo = await this.obtenerSemestreActivo();
           
            if (!semestreActivo) {
                return response.status(400).send({ 
                    message: 'No existe semestre activo', 
                    success: false 
                });
            }
    
            return response.status(200).json({
                message: '',
                data: semestreActivo
            });
         
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async culminar_semestre({ response }: HttpContext) {
        try {
          const semestresActivos = await this.obtenerSemestreActivo();
      
          if (!semestresActivos || semestresActivos.length === 0) {
            return response.status(400).send({
              message: 'No existe semestre activo',
              success: false,
            });
          }
      
          const semestreActivo = semestresActivos[0];
          const aulas = await SemestreProfesorAulaService_.obtener_todas_aulas_con_profesor(semestreActivo.id) || [];
      
          // Verificar si todas las aulas están deshabilitadas
          const todasAulasDeshabilitadas = aulas.every((aula) => aula.habilitado === false);
      
          if (!todasAulasDeshabilitadas) {
                const profesoresConAulasHabilitadas = [
                ...new Set(
                    aulas
                    .filter((aula) => aula.habilitado === true)
                    .map((aula) => aula.profesor_id)
                )
                ];
            
                const profesoresInfo = await Promise.all(
                    profesoresConAulasHabilitadas.map((id) =>
                    UsersController_.consultar_user_by_ID(id)
                    )
                );
              
                const emails = profesoresInfo
                    .filter((prof): prof is any => prof !== null)
                    .map((prof) => prof.email);

              
                return response.status(400).send({
                    message: `Los siguientes profesores aún tienen secciones habilitadas: ${emails.join(', ')}`,
                    success: false,
                });
          }
          
      
          // Si todo está correcto, finalizar el semestre
          semestreActivo.date_end = DateTime.now();
          semestreActivo.active = false;
          await semestreActivo.save();
      
          return response.status(200).json({
            success: true,
            message: 'Semestre culminado correctamente',
          });
      
        } catch (error) {
          console.error(error);
          return response.status(500).send({
            message: 'Error interno del servidor',
            success: false,
          });
        }
    }

    public async get_semestrebyID({ params, response }: HttpContext) {
    
        try {

            const semestre = await SemestreService_.obtenerSemestreByID(params.id);
    
            if (!semestre) {
                return response.status(404).json({ message: 'Seccion no encontrada' });
            }
    
            return response.status(200).json({
                message: '',
                data: semestre
            });
        } catch (error) {
            console.error('Error obteniendo el semestre:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_semestre({ request, response }: HttpContext) {
        try {
            const { id, nombre, date_start } = request.only(['id', 'nombre','date_start']);
            const semestre = await SemestreService_.obtenerSemestreByID(id);
            if (!semestre) {
                return response.status(404).json({
                    message: 'No existe semestre',
                    success: false,
                });
            }

            try {
                
                semestre.merge({ nombre, date_start });
                await semestre.save();

                return response.status(200).json({
                    message: 'semestre actualizado con éxito',
                    data: semestre,
                });

            } catch (saveError) {
                console.error(`Error al guardar del aula: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios del aula',
                    success: false,
                    error: saveError.message,
                });
            }

        } catch (error) {
            console.error(`Error en edit: ${error.message}`);
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false,
                error: error.message,
            });
        }
    }
      
        

}