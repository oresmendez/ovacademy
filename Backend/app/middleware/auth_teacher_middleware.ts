import type { HttpContext } from '@adonisjs/core/http';
import Api_tokensService from '../controllers/authentication/token.js';

const Api_tokensService_ = new Api_tokensService();

export default class AuthMiddleware {
    
    public async handle(ctx: HttpContext, next: () => Promise<void>) {
        
        const {response } = ctx;

        try {

            const userAuthorized = await Api_tokensService_.verifyToken(ctx);

            if (userAuthorized && userAuthorized.type_id !== undefined) {
                
                if (userAuthorized.type_id <= 1) {
                    return response.status(401).send({ 
                        message: 'No autorizado', 
                        success: false 
                    });
                }
                
                await next();
                
            
            } else {
            
            return response.status(401).send({ 
                message: 'Token no proporcionado o inválido', 
                success: false 
            });
            }
        } catch (error) {
            console.error('Error en AuthMiddleware:', error.message);
            
            // Responder con error interno del servidor
            return response.status(500).send({ 
            message: 'Error interno del servidor', 
            success: false 
            });
        }
    }
}
    