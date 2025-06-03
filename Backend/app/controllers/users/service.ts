import User from '../../models/authentication/user.js'

export default class UserService {

    private readonly userModel = User;
    
    async crear_usuario(email: string, name: string, surname: string, type_id: number, status_logico: boolean): Promise<User | null> {
        try {
            return await this.userModel.create({
            email,
            name, 
            surname,
            type_id,
            status_logico
            })
        } catch (error) {
            console.error('Error creando usuario en UserService:', error.message)
            return null
        }
    }

    async consultar_user_by_email(email: string): Promise<User | null> {
        try {
            
            return await this.userModel.query().where('email', email).first();

        } catch (error) {
            console.error(`Error obteniendo usuario por en UserService:`, error.message);
            return null;
        }
    }

    async consultar_user_by_ID(id: number): Promise<User | null> {
        try {
            
            return await this.userModel.query().where('id', id).first();

        } catch (error) {
            console.error(`Error obteniendo usuario por en UserService:`, error.message);
            return null;
        }
    }

    async consultar_user_si_esta_habilitado(email: string): Promise<User | null> {
        try {
            const user = await this.userModel.query()
                .where('email', email)
                .where('status_logico', true)
                .where('eliminado', false)
                .first();
            return user ?? null;
        } catch (error) {
            console.error(`Error obteniendo usuario en UserService:`, error.message);
            return null;
        }
    }    

    async listado_usuarios(type_id: number): Promise<Partial<User & { semestre?: string; habilitado?: boolean }>[] | null> {
        
        const query = this.userModel.query()
            .where('type_id', type_id)
            .select('id', 'email', 'name', 'surname', 'phone', 'status_logico')
            .where('eliminado', 'False')
            .orderBy('id', 'asc');
    
        if (type_id === 1) {
            query
                .leftJoin(
                    'universidad.estudiante',
                    'universidad.estudiante.user_id',
                    'authentication.user.id'
                )
                .select(
                    'universidad.estudiante.semestre',
                    'universidad.estudiante.habilitado'
                );
        }

        if (type_id === 2) {
            query
                .leftJoin(
                    'universidad.profesor',
                    'universidad.profesor.user_id',
                    'authentication.user.id'
                )
                .select(
                    'universidad.profesor.habilitado'
                );
        }
    
        // Ejecutar la consulta
        const users = await query;
    
        // Si no se encuentran usuarios, devolver null
        if (users.length === 0) {
            return null;
        }
    
        // Devolver la lista de usuarios
        return users;
    }

    async editar_usuario(email: string, name: string, surname: string, phone: string): Promise<User | null> {
        try {
    
            const user = await this.consultar_user_by_email(email);
            
            if (!user) {
                console.error('Usuario no encontrado');
                return null;
            }
            
            user.merge({ name, surname, phone });
            return user.save();

        } catch (error) {
            console.error('Error editando usuario en UserService:', error.message);
            return null;
        }
    }

    async eliminar_usuario(user_id: number): Promise<User | null> {
        try {
            const user = await this.userModel.findOrFail(user_id)
            await user.delete()
            return user
        } catch (error) {
            console.error('Error al eliminar un usuario:', error.message);
            return null;
        }
    }
}
