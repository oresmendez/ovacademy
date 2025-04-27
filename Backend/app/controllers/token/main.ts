import type { HttpContext } from '@adonisjs/core/http'

import TokenService from './service.js'
const TokenService_ = new TokenService();

export default class TokenController {

    public async create_token(user_id: number, type_id: number): Promise<{ token: string } | null> {
        try {
            const tokenObj = await TokenService_.crear_token(user_id, type_id);
            if (tokenObj) {
                return { token: tokenObj.token };
            }
            return null;
        } catch (error) {
            console.error('Error al crear el token:', error);
            return null;
        }
    }

    obtenerUserByToken = async (token: string) => {
        return await TokenService_.ObtenerUserbyToken(token)
    }
    

    public async verifyToken({ request, response }: HttpContext) {

        const token = request.header('token');
        if (!token) {return response.unauthorized({ message: 'Token requerido' });}

        const userByToken = await this.obtenerUserByToken(token);

        if (!(userByToken && userByToken.length > 0)) {
            return response.notFound({ message: 'No se encontro un token valido de usuario' });
        }

        return response.ok({ data: 
            { 
                user_id: userByToken[0].$attributes.user_id, 
                type_id: userByToken[0].$attributes.type_id 
            } 
        });  
    
    }

}