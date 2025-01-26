
import User from '../../models/user.js';

export default class UserService {
    
    async show(field: 'email' | 'id', value: string | number): Promise<User | null> {
        try {
            const user = await User.query().where(field, value).first();
            return user || null;
        } catch (error) {
            console.error(`Error obteniendo usuario por ${field} en UserService:`, error.message);
            return null;
        }
    }

    async listado_usuarios(type_id: number): Promise<Partial<User>[] | null> {
        
        const users = await User.query()
            .where('type_id', type_id)
            .select('id', 'email', 'name', 'surname', 'phone', 'status_logico')
            .orderBy('id', 'desc');
    
        if (users.length === 0) {
            return null;
        }
    
        return users;
    }
    

    async store(email: string, type_id: number): Promise<User | null> {
        try {
            const user = await User.create({
                email,
                type_id,
            });
            return user;
        } catch (error) {
            console.error('Error creando usuario en UserService:', error.message);
            return null;
        }
    }

    async edit(email: string): Promise<User | null> {
        try {
            return await User.findByOrFail('email', email)
        } catch (error) {
            console.error('Error creando usuario en UserService:', error.message);
            return null;
        }
    };
}