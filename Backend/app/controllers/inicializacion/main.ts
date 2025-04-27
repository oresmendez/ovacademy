import type { HttpContext } from '@adonisjs/core/http'

import UsersController from '../users/main.js'
const UsersController_ = new UsersController();

import SesioneController from '../sesiones/main.js'
const SesioneController_ = new SesioneController();

export default class InicializacionController {

    readonly #create_root = async (email: string) => {

        const userRoot = await UsersController_.consultar_user_by_email(email)

        if (!userRoot) {
            await UsersController_.create_user(email, "", "", 3);
            return await UsersController_.consultar_user_by_email(email)
        }
        return userRoot        
    }

    public async inicializar_ova({ response }: HttpContext) {
        
        const userRoot = await this.#create_root("root@udo.com.ve")

        if (!userRoot) {
            return response.status(400).send({ 
                message: 'Error al crear al usuario root', 
                success: false 
            });
        }

        if (!await SesioneController_.create_password(userRoot.id, "1234")) {
            return response.status(400).send({ 
                message: 'error en ecriptar la contrasena', 
                success: false 
            });
        }

        return response.status(200).json({
            data: true,
        });
    
    }

}