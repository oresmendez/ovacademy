import type { HttpContext } from '@adonisjs/core/http'

import AdministradorService from './service.js';
const AdministradorService_ = new AdministradorService();


export default class AdministradorController {

    create_administrador = async (user_id: number) => {
        return await AdministradorService_.create_administrador(user_id)
    }

}