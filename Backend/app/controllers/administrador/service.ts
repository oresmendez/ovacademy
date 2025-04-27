import Administrador from '../../models/universidad/administrador.js';


export default class AdministradorService {

    async create_administrador(user_id: number): Promise<Administrador | null> {
        try {
            const user = await Administrador.create({
                user_id,
            });
            return user;
        } catch (error) {
            console.error('Error creando usuario en AdministradorService:', error.message);
            return null;
        }
    }

    async edit(user_id: number): Promise<Administrador | null> {
        try {
            return await Administrador.findByOrFail('user_id', user_id)
        } catch (error) {
            console.error('Error consultando al usuario en AdministradorService:', error.message);
            return null;
        }
    };

}