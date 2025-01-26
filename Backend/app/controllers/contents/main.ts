


import type { HttpContext } from '@adonisjs/core/http'
import ContentService from '../../controllers/contents/service.js'

const ContentService_ = new ContentService();

export default class ContentsController {
    
    public async index({ request }: HttpContext) {
    
        const { id } = request.only(['id']);
    
        return await ContentService_.obtenerContenidoDeUnaUnidad(id);
    
    }

    public async show({ request }: HttpContext) {
    
        const { id } = request.only(['id']);
    
        return await ContentService_.obtenerDetallesDeUnContenido(id);
    
    }
}
