import type { HttpContext } from '@adonisjs/core/http'

import EstudianteService from './service.js';
const EstudianteService_ = new EstudianteService();


export default class EstudianteController {

    create_estudiante = async (user_id: number) => {
        return await EstudianteService_.create_estudiante(user_id)
    }

}