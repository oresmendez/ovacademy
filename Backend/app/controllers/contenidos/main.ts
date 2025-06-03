


import type { HttpContext } from '@adonisjs/core/http'
import ContenidoService from '../../controllers/contenidos/service.js'

const ContenidoService_ = new ContenidoService();

export default class ContenidosController {
      
    public async create_contenido({ request, response }: HttpContext) {
        try {
            
            const { id_unidad, nombre, descripcion } = request.only(['id_unidad', 'nombre', 'descripcion'])
            const contenido = await ContenidoService_.crear_contenido(id_unidad, nombre, descripcion)

            if (!contenido) {
                return response.status(400).send({ 
                    message: 'Error al crear la unidad', 
                    success: false 
                });
            }

            return response.status(200).json({
                message: 'contenido creado'
            });
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async get_ContenidoByUnidad({ params, response }: HttpContext) {

        try {
            const unidad = await ContenidoService_.obtenerContenidoDeUnaUnidad(params.unidad);
    
            if (!unidad) {
                return response.status(404).json({ message: 'Unidad no encontrada' });
            }
    
            return response.status(200).json(unidad);
        } catch (error) {
            console.error('Error obteniendo la unidad:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async get_ContenidoDetails({ params, response }: HttpContext) {
        
        const contenido = await ContenidoService_.obtenerDetallesDeUnContenido(params.id);
    
        if (!contenido) {
            return response.status(404).json({ message: 'Contenido no encontrado' });
        }
    
        return response.json(contenido);
    }

    public async edit_contenido_by_Id({ request, response }: HttpContext) {
        try {
            
            const { id, nombre, descripcion } = request.only(['id', 'nombre', 'descripcion']);

            const contenido = await ContenidoService_.obtenerDetallesDeUnContenido(id);
    
            if (!contenido) {
                return response.status(404).json({
                    message: 'Contenido no encontrado',
                });
            }
            
            try {
                contenido.merge({ id, nombre, descripcion });
                await contenido.save();
    
                return response.status(200).json({
                    message: 'Contenido actualizado con éxito',
                    data: contenido,
                });
    
            } catch (saveError) {
                console.error(`Error al guardar el contenido: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios del Contenido',
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

    public async habilitar_or_deshabilitar_contenido({ params, response }: HttpContext) {
            
        try {
            
            const contenido = await ContenidoService_.obtenerDetallesDeUnContenido(params.id);
    
            if (!contenido) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                });
            }
    
            contenido.status = !contenido.status
    
            await contenido.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }

    public async delete({ params, response }: HttpContext) {
        
        try {
            
            const { id } = params;
            if (!await ContenidoService_.soft_delete(id)) {
                return response.status(400).send({ 
                    message: 'Error al eliminar la unidad', 
                    success: false 
                });
            }
            return response.status(200).send({ message: 'Unidad eliminada correctamente',});

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }

}
