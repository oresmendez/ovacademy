import type { HttpContext } from '@adonisjs/core/http';
import Api_tokens from '../../models/api_tokens.js'

import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { DateTime } from 'luxon';

export default class Api_tokensService {

    public async create(user_id: number, type_id: number): Promise<{ success: boolean; token: string } | null> {

        const token = (await promisify(randomBytes)(16)).toString('hex');

        await Api_tokens.create({
            user_id: user_id,
            type_id: type_id,
            token,
            // expires_at: DateTime.now().plus({ days: 7 }), // El token expira en 7 días
            expires_at: DateTime.now().plus({ seconds: 5 }), // El token expira en 5 segundos
        });

        return { success: true, token: token };
    }


    public async verifyToken({ request }: HttpContext): Promise<{ user_id: number; id: number; type_id: number } | null> {
        const token = request.header('token');
    
        if (!token) {
            return null;
        }
    
        const tokenRecord = await Api_tokens.query().where('token', token).first();
    
        if (!tokenRecord) {
            return null;
        }
    
        return { 
            id: tokenRecord.id, 
            user_id: tokenRecord.user_id, 
            type_id: tokenRecord.type_id 
        };
    }
    
    
}
    