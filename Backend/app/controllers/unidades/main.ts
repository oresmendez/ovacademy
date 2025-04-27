
import type { HttpContext } from '@adonisjs/core/http'

import UnidadService from '../../controllers/unidades/service.js'
const UnidadService_ = new UnidadService();

import TokenController from '../token/main.js';
const TokenController_ = new TokenController();

import SemestreProfesorAulController from '../semestre_profesor_aula/main.js';
const SemestreProfesorAulController_ = new SemestreProfesorAulController();

import EstudianteAulaController from '../estudiante_aula/main.js';
const EstudianteAulaController_ = new EstudianteAulaController();

export default class UnidadesController {

    consultar_unidades_by_user = async (user_id: number) => {
        return await UnidadService_.obtenerUnidades(user_id);
    }

    consultar_unidad_by_ID = async (unidad_id: number) => {
        return await UnidadService_.obtenerUnidadesByID(unidad_id);
    }

    public async create_unidad({ request, response }: HttpContext) {
        try {
            
            const token = request.header('token');
            if (!token) {return response.unauthorized({ message: 'Token requerido' });}
            const userByToken = await TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const unidades = await this.consultar_unidades_by_user(userByToken[0].user_id);
            let totalNotas = 0;

            if (unidades && unidades.length > 0) {
                totalNotas = unidades.reduce((total, unidad) => {
                    const datos = unidad.toJSON(); 
                    return total + parseFloat(datos.notaUnidad);
                }, 0);
            } 

            const { modulo, nombre, descripcion, nota_unidad } = request.only(['modulo', 'nombre', 'descripcion', 'nota_unidad'])            
            
            if(totalNotas + parseFloat(nota_unidad) > 10){
                return response.status(400).send({ 
                    message: 'La nueva nota excede la cantidad de 10 puntos', 
                    success: false 
                });
            }
            
            const unidad = await UnidadService_.crear_unidad(modulo, nombre, descripcion, userByToken[0].user_id, nota_unidad)

            if (!unidad) {
                return response.status(400).send({ 
                    message: 'Error al crear la unidad', 
                    success: false 
                });
            }

            return response.status(200).json({
                message: 'unidad creada'
            });
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor', error,
                success: false
            });
        }
    }

    public async get_unidades_by_profesor({ request, response }: HttpContext) {
    
        try {
            const token = request.header('token');

            if (!token) {return response.unauthorized({ message: 'Token requerido' });}
            const userByToken = await TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const unidades = await this.consultar_unidades_by_user(userByToken[0].user_id);
    
            if (!unidades) {
                return response.status(400).send({ 
                    message: 'Error al obtener las unidades', 
                    success: false 
                });
            }
    
            return response.status(200).json({
                message: 'listado de unidades',
                data: unidades
            });
            
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async get_unidades_by_estudiante({ request, response }: HttpContext) {
    
        try {

            const token = request.header('token');

            if (!token) {return response.unauthorized({ message: 'Token requerido' });}
            const userByToken = await TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const Aula_estudiante = await EstudianteAulaController_.consultar_aula_by_estudiante(userByToken[0].user_id);

            let Aula_profesor;
            if (Aula_estudiante) {
                Aula_profesor = await SemestreProfesorAulController_.obtener_datos_aula(
                    Aula_estudiante.semestre_profesor_aula_id
                );
            }

            const unidades = await UnidadService_.obtenerUnidades(Aula_profesor.profesor_id);
    
            if (!unidades) {
                return response.status(400).send({ 
                    message: 'Error al obtener las unidades', 
                    success: false 
                });
            }
    
            return response.status(200).json({
                message: 'listado de unidades',
                data: unidades
            });
            
            
        } catch (error) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    }



    public async get_UnidadById({ params, response }: HttpContext) {

        try {

            const unidad = await this.consultar_unidad_by_ID(params.id);
    
            if (!unidad) {
                return response.status(404).json({ message: 'Unidad no encontrada' });
            }
    
            return response.status(200).json({
                message: '',
                data: unidad
            });
        } catch (error) {
            console.error('Error obteniendo la unidad:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_unidad_by_Id({ request, response }: HttpContext) {
        try {
            
            const { id, modulo, nombre, nota_unidad, descripcion } = request.only(['id', 'modulo', 'nombre', 'nota_unidad', 'descripcion']);
            
            const unidad = await UnidadService_.obtenerUnidadesByID(id);
    
            if (!unidad) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                });
            }
            
            try {
                unidad.merge({ id, modulo, nombre, nota_unidad, descripcion });
                await unidad.save();
    
                return response.status(200).json({
                    message: 'Unidad actualizada con éxito',
                    data: unidad,
                });
    
            } catch (saveError) {
                console.error(`Error al guardar la Unidad: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios de la Unidad',
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

    public async habilitar_or_deshabilitar_unidad({ params, response }: HttpContext) {
        
        try {
            
            const unidad = await UnidadService_.obtenerUnidadesByID(params.id);
    
            if (!unidad) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                });
            }
    
            unidad.status = !unidad.status
    
            await unidad.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }
    

}
