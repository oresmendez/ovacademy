import type { HttpContext } from '@adonisjs/core/http'

import TokenService from './service.js'
const TokenService_ = new TokenService();

export default class TokenController {

    private token: string | null | undefined = null;
    private user_id: Array<{ user_id: number }> | null = null;

    constructor() {
        this.token = null;
    }

    get_user_id_by_token = async (ctx: HttpContext) => {

        const { request, response } = ctx; 
    
        this.token = request.header('token') ?? null;
        
        if (!this.token) {
            response.unauthorized({ message: 'Token requerido' });
            return null;
        }

        this.user_id = await TokenService_.ObtenerUserbyToken(this.token)

        if (!(this.user_id && this.user_id.length > 0)) {
            response.notFound({ message: 'No se encontró un token válido de usuario' });
            return null;
        }

        return this.user_id[0].user_id;
    }

    obtenerUserByToken = async (token: string) => {
        return await TokenService_.ObtenerUserbyToken(token)
    }
    

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