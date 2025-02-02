import Profesor from '../../models/profesor.js';


export default class ProfesorService {

    async store(user_id: number): Promise<Profesor | null> {
        try {
            const user = await Profesor.create({
                user_id,
            });
            return user;
        } catch (error) {
            console.error('Error creando usuario en ProfesorService:', error.message);
            return null;
        }
    }

    async edit(user_id: number): Promise<Profesor | null> {
        try {
            return await Profesor.findByOrFail('user_id', user_id)
        } catch (error) {
            console.error('Error consultando al usuario en ProfesorService:', error.message);
            return null;
        }
    };

}