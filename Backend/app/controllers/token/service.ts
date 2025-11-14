import Token from '../../models/authentication/token.js'

import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { DateTime } from 'luxon';

export default class TokenService {

    private readonly tokenModel = Token;

    async crear_token(user_id: number, type_id: number): Promise<Token | null> {
        try {
            const tokenGenerado = (await promisify(randomBytes)(16)).toString('hex');
            const nuevoToken = await this.tokenModel.create({
                user_id,
                type_id,
                token: tokenGenerado,
                expires_at: DateTime.now().plus({ seconds: 5 }),
            });
    
            return nuevoToken; // Se retorna el objeto completo que cumple con el tipo Token
    
        } catch (error) {
            console.error('Error creando el token en TokenService:', error.message);
            return null;
        }
    }

    async ObtenerUserbyToken(token: string): Promise<Array<Token> | null> {
        try {
            return await this.tokenModel.query()
            .select('user_id', 'type_id')
            .where('token', token);
            // .where('expires_at', '>', DateTime.now().toSQL());
        } catch (error) {
            console.error('Error obteniendo user de token:', error);
            return null;
        }
    }

    async delete_token_user(user_id: number): Promise<boolean> {
        try {
            // Obtener el último token del usuario
            const lastToken = await this.tokenModel.query()
            .where('user_id', user_id)
            .orderBy('created_at', 'desc') // o 'id', si no tienes created_at
            .first();

            if (!lastToken) {
                return false; // No hay tokens que eliminar
            }

            // Eliminar el token
            await lastToken.delete();

            return true;
        } catch (error) {
            console.error('Error deleting last token for user:', error);
            return false;
        }
    }


    

}