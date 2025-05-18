import Estudiante from '../../models/universidad/estudiante.js';

export default class EstudianteService {

    private readonly estudianteModel = Estudiante;
    
    async create_estudiante(user_id: number): Promise<Estudiante | null> {
        try {
            const user = await this.estudianteModel.create({
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
            return await this.estudianteModel.findByOrFail('user_id', user_id)
        } catch (error) {
            console.error('Error consultando al usuario en EstudianteService:', error.message);
            return null;
        }
    };

}