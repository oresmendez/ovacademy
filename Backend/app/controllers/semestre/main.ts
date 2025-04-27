import type { HttpContext } from '@adonisjs/core/http'
import SemestreService from '../../controllers/semestre/service.js'

const SemestreService_ = new SemestreService();


export default class SemestreController {

    public async create_semestre({ request, response }: HttpContext) {
        try {

            const semestreActivo = await SemestreService_.obtenerSemestreActivo()
           
            if (semestreActivo) {
                return response.status(403).send({ 
                    message: 'Debe finalizar el semestre en curso', 
                    success: false 
                });
            }

            const { nombre, fecha_inicio, fecha_fin } = request.only(['nombre', 'fecha_inicio', 'fecha_fin'])
            const semestre = await SemestreService_.crear_semestre(nombre, fecha_inicio, fecha_fin)

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

    obtenerSemestreActivo = async () => {
        return await SemestreService_.obtenerSemestreActivo()
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
        

}