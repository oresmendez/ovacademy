import type { HttpContext } from '@adonisjs/core/http'

import ProfesorService from './service.js';
const ProfesorService_ = new ProfesorService();


export default class ProfesorController {

    create_profesor = async (user_id: number) => {
        return await ProfesorService_.create_profesor(user_id)
    }

}