import type { HttpContext } from '@adonisjs/core/http'

import EstudianteAulaService from '../../controllers/estudiante_aula/service.js'
const EstudianteAulaService_ = new EstudianteAulaService();

import SemestreController from '../semestre/main.js';
const SemestreController_ = new SemestreController();


export default class EstudianteAulaController {

    consultar_aula_by_estudiante = async (estudiante_id: number) => {
        
        const semestre = await SemestreController_.obtenerSemestreActivo();
        
        if (!semestre) {return false}

        const estudiante = await EstudianteAulaService_.obtener_un_estudiante_inscrito(semestre.id, estudiante_id);

        if (!estudiante) {
            return false
        }

        return estudiante
    }

    obtener_detalles_del_aula = async (semestre_profesor_aula_id: number) => {
        
        const semestre = await SemestreController_.obtenerSemestreActivo();
        if (!semestre) {return false}

        const estudiante = await EstudianteAulaService_.obtener_detalles_del_aula(semestre.id, semestre_profesor_aula_id);

        if (!estudiante) {
            return false
        }

        return estudiante
    }

    public async registrar_estudiante_a_aula({ request, response }: HttpContext) {
        try {
            const dataObject = request.all();
            const data = Object.values(dataObject);
    
            let errores: any[] = [];
            let exitos: any[] = [];

            const semestre = await SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}
    
            for (const estudiante of data) {
                const { semestre_profesor_aula_id, estudiante_id } = estudiante;
    
                if (!semestre_profesor_aula_id || !estudiante_id) {
                    errores.push({
                        estudiante_id: estudiante.estudiante_id || 'desconocido',
                        message: 'Datos incompletos: faltan semestre_profesor_aula_id o estudiante_id'
                    });
                    continue;
                }
    
                const resultado = await EstudianteAulaService_.registrar_estudiante_aula(
                    semestre_profesor_aula_id,
                    semestre.id,
                    estudiante_id
                );
    
                if (!resultado) {
                    errores.push({ estudiante_id, message: 'Error al asociar al aula' });
                } else {
                    exitos.push({ estudiante_id, message: 'Estudiante inscrito con éxito' });
                }
            }
    
            return response.status(200).json({
                message: 'Proceso finalizado',
                success: errores.length === 0,
                inscritos: exitos,
                errores: errores
            });
    
        } catch (error) {
            console.error(error);
            return response.internalServerError({ message: 'Error interno del servidor' });
        }
    }

    public async obtener_estudiantes_inscritos_aula_general({ request, response }: HttpContext) {
        
        try {

            const semestre = await SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const estudiantesInscritos = await EstudianteAulaService_.obtener_estudiantes_inscritos_generales(semestre.id);


            return response.status(200).json({
                message: 'estudiantes inscritos',
                estudiantesInscritos
            });
            
        } catch (error) {return response.internalServerError({ message: 'Error interno del servidor' });}
    }

    public async obtener_estudiantes_inscritos_by_aula({ request, response }: HttpContext) {
        try {

			const semestre = await SemestreController_.obtenerSemestreActivo()
		
			if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

			const { aulaId } = request.only(['aulaId'])

			const estudiantesInscritos = await EstudianteAulaService_.obtener_estudiantes_inscritos_by_aula(
				semestre.id,
				aulaId
			)
		
			if (!estudiantesInscritos || estudiantesInscritos.length === 0) {
				return response.status(401).json({
				message: 'No hay estudiantes inscritos en este aula',
				estudiantes: []
				})
			}
		
			const estudiantes = estudiantesInscritos.map((e) => ({
				id: e.$extras.id,
				name: e.$extras.name,
				surname: e.$extras.surname,
				email: e.$extras.email,
				nota_final: e.nota_final
			}))
			
			return response.status(200).json({
				message: 'Estudiantes inscritos',
				data: estudiantes
			})

        } catch (error) {
          console.error(error)
          return response.internalServerError({ message: 'Error interno del servidor' })
        }
    }

    editar_nota_final = async (estudiante_id: number, nota_final: number) => {
        
        const Aula_estudiante = await this.consultar_aula_by_estudiante(estudiante_id);

        if (!Aula_estudiante) {
            return false
        }

        try {
            Aula_estudiante.merge({ nota_final })
            await Aula_estudiante.save()
            return true

        } catch (saveError) {
            console.error('Error al guardar la nota final:', saveError)
            return false
        }

    }

    public async desmatricular_estudiante({ params, response }: HttpContext) {
    
        try {

            const semestre = await SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const estudiante = await EstudianteAulaService_.obtener_un_estudiante_inscrito(semestre.id, params.id);

            if (!estudiante) {
                return response.status(404).json({ message: 'Estudiante no encontrado' })
            }

            await estudiante.delete()

            return response.status(200).json({ message: 'Registro eliminado correctamente' })
            
        } catch (error) {
            console.error(error);
            return response.internalServerError({ message: 'Error interno del servidor ' });}
    }
      
    
    
    
    
    

}