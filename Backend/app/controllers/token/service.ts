import Token from '../../models/authentication/token.js'

import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { DateTime } from 'luxon';

export default class TokenService {

    async crear_token(user_id: number, type_id: number): Promise<Token | null> {
        try {
            const tokenGenerado = (await promisify(randomBytes)(16)).toString('hex');
            const nuevoToken = await Token.create({
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
            return await Token.query()
            .select('user_id', 'type_id')
            .where('token', token);
            // .where('expires_at', '>', DateTime.now().toSQL());
        } catch (error) {
            console.error('Error obteniendo user de token:', error);
            return null;
        }
    }
    


    

}