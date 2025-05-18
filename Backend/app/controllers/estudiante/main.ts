
import EstudianteService from './service.js';

export default class EstudianteController {

    private readonly EstudianteService_: EstudianteService;

    constructor() {
        this.EstudianteService_ = new EstudianteService();
    }

    create_estudiante = async (user_id: number) => {
        return await this.EstudianteService_.create_estudiante(user_id)
    }

}