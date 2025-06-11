import type { HttpContext } from '@adonisjs/core/http'

import NotaEstudianteService from '../../controllers/notas_estudiante/service.js'
const NotaEstudianteService_ = new NotaEstudianteService();

import TokenController from '../token/main.js';
const TokenController_ = new TokenController();

import SemestreController from '../semestre/main.js';
const SemestreController_ = new SemestreController();

import EstudianteAulaController from '../estudiante_aula/main.js';
const EstudianteAulaController_ = new EstudianteAulaController();

export default class NotaEstudianteController {

    obtener_notas_estudiante = async (estudiante_id: number, semestre_id: number) => {
      	return await NotaEstudianteService_.obtener_nota_estudiantes(estudiante_id, semestre_id)
  	}

    sumar_notas_estudiante = async (estudiante_id: number, semestre_id: number) => {

		const semestre = await SemestreController_.obtenerSemestreActivo();
        if (!semestre) {return false}

		const notas_estudiante = await this.obtener_notas_estudiante(estudiante_id, semestre.id)
		
		if (!notas_estudiante || !Array.isArray(notas_estudiante)) {
			console.log('No se encontraron notas para el estudiante')
			return 0
		}

		return notas_estudiante
			.filter((nota) => {
				const semestreId = nota.$attributes.semestre_id
				return semestreId === semestre_id
			})
			.reduce((total, nota) => {
				const valor = parseFloat(nota.$attributes.nota_evaluacion)
				return total + (isNaN(valor) ? 0 : valor)
			}, 0)

	}


    public async crear_nota_estudiante({ request, response }: HttpContext) {

        try {

            const token = request.header('token');
            if (!token) {return response.unauthorized({ message: 'Token requerido' });}
            const userByToken = await TokenController_.obtenerUserByToken(token);
            if (!(userByToken && userByToken.length > 0)) {return response.notFound({ message: 'No se encontro un token valido de usuario' });}

            const semestre = await SemestreController_.obtenerSemestreActivo();
			if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const { nota_evaluacion, evaluacion_id } = request.only(['nota_evaluacion', 'evaluacion_id'])
            
            if (!await NotaEstudianteService_.registrar_nota_estudiante(parseFloat(nota_evaluacion), userByToken[0].user_id, evaluacion_id, semestre.id)) {
                return response.badRequest({ message: 'Error en crear la nota' });
            }else{
				const nota = await this.sumar_notas_estudiante(userByToken[0].user_id, semestre.id);
				if (!nota) {return response.badRequest({ message: 'Error al sumar las notas' });}
				
				const actualizar_nota = await EstudianteAulaController_.editar_nota_final(userByToken[0].user_id, nota);
				if (!actualizar_nota) {return response.badRequest({ message: 'Error al actualizar la nota final' });}
				return response.created({ message: 'nota creada' });
			}

            
        } catch (error) {return response.internalServerError({ message: 'Error interno del servidor' });}

    }

    public async get_notas_estudiante({ params, response }: HttpContext) {
        try {

			const semestre = await SemestreController_.obtenerSemestreActivo();
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

			const notas_estudiante = await this.obtener_notas_estudiante(params.estudiante_id, semestre.id)
      
			if (!notas_estudiante) {
				return response.badRequest({ message: 'Error al obtener las notas del estudiante' })
			}
      
			const datosFormateados = notas_estudiante.map((nota) => {
				return {
				...nota.toJSON(),
				id_unidad: nota.$extras.id_unidad, // Aquí accedes al campo extra
				}
			})
      
			return response.ok({
				message: 'Listado de notas del estudiante',
				data: datosFormateados,
			})
        } catch (error) {
			console.error('Error en get_notas_estudiante:', error)
			return response.internalServerError({ message: 'Error interno del servidor' })
        }
    }

    public async get_notas_estudiante_by_unidad({ params, response }: HttpContext) {
        try {

			const semestre = await SemestreController_.obtenerSemestreActivo();
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

          const notas_estudiante = await NotaEstudianteService_.obtener_nota_estudiantes_by_unidad(params.estudiante_id, params.id_unidad, semestre.id)
      
          if (!notas_estudiante) {
            return response.badRequest({ message: 'Error al obtener las notas del estudiante' })
          }
      
          const datosFormateados = notas_estudiante.map((nota) => {
            return {
              ...nota.toJSON(),
              id_unidad: nota.$extras.id_unidad, // Aquí accedes al campo extra
            }
          })
      
          return response.ok({
            message: 'Listado de notas del estudiante',
            data: datosFormateados,
          })
        } catch (error) {
          console.error('Error en get_notas_estudiante:', error)
          return response.internalServerError({ message: 'Error interno del servidor' })
        }
    }

    public async get_notas_estudiante_by_evaluacion({ params, response }: HttpContext) {
        try {
			const semestre = await SemestreController_.obtenerSemestreActivo();
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

          const notas_estudiante = await NotaEstudianteService_.obtener_nota_estudiantes_by_evaluacion(params.estudiante_id, params.evaluacion_id, semestre.id)
      
          if (!notas_estudiante) {
            return response.badRequest({ message: 'Error al obtener las notas del estudiante' })
          }
      
          const datosFormateados = notas_estudiante.map((nota) => {
            return {
              ...nota.toJSON(),
              id_unidad: nota.$extras.id_unidad, // Aquí accedes al campo extra
            }
          })
      
          return response.ok({
            message: 'Listado de notas del estudiante',
            data: datosFormateados,
          })
        } catch (error) {
          console.error('Error en get_notas_estudiante:', error)
          return response.internalServerError({ message: 'Error interno del servidor' })
        }
    }

    public async edit_nota({ request, response }: HttpContext) {
		try {

			const semestre = await SemestreController_.obtenerSemestreActivo();
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}
			
			const { estudiante_id, evaluacion_id, nota_evaluacion } = request.only(['estudiante_id', 'evaluacion_id', 'nota_evaluacion']);
			
			const nota = await NotaEstudianteService_.editar_nota(estudiante_id, evaluacion_id, semestre.id, nota_evaluacion);
			if (!nota) {
				return response.status(404).json({
					message: 'nota no encontrado',
				});
			}else{
				const nota = await this.sumar_notas_estudiante(estudiante_id, semestre.id);
				if (!nota) {return response.badRequest({ message: 'Error al sumar las notas' });}
				
				const actualizar_nota = await EstudianteAulaController_.editar_nota_final(estudiante_id, nota);
				if (!actualizar_nota) {return response.badRequest({ message: 'Error al actualizar la nota final' });}
				return response.status(200).json({
					message: 'Contenido actualizado con éxito',
					data: nota,
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