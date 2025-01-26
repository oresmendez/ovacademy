import Estudiante from '../../models/estudiante.js';


export default class EstudianteService {

    async store(user_id: number): Promise<Estudiante | null> {
        try {
            const user = await Estudiante.create({
                user_id,
            });
            return user;
        } catch (error) {
            console.error('Error creando usuario en EstudianteService:', error.message);
            return null;
        }
    }

    async edit(user_id: number): Promise<Estudiante | null> {
        try {
            return await Estudiante.findByOrFail('user_id', user_id)
        } catch (error) {
            console.error('Error consultando al usuario en EstudianteService:', error.message);
            return null;
        }
    };

}