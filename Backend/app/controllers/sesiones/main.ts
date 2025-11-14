import type { HttpContext } from '@adonisjs/core/http'

import SesioneService from './service.js'
import TokenController from '../token/main.js';

export default class SesioneController {

    private readonly SesioneService_: SesioneService;
    private readonly TokenController_: TokenController;

    constructor() {
        this.SesioneService_ = new SesioneService();
        this.TokenController_ = new TokenController();
    }

    consultar_user_by_email = async (email: string) => {

        const { default: UsersController } = await import('../users/main.js');
        const UsersController_ = new UsersController();

        return await UsersController_.consultar_user_by_email(email)
    }

    consultar_user_si_esta_habilitado = async (email: string) => {

        const { default: UsersController } = await import('../users/main.js');
        const UsersController_ = new UsersController();

        return await UsersController_.consultar_user_si_esta_habilitado(email)
    }

    create_password = async (user_id: number, password: string) => {

        if (!await this.SesioneService_.store(user_id, password)) {
            return false
        }
        return true
    }

    readonly #createApiToken = async (userId: number, userTypeId: number) => {
        try {
            return await this.TokenController_.create_token(userId, userTypeId);
        } catch (error) {
            console.error('Error al crear el token:', error);
            return null;
        }
    }

    readonly #verify_password = async (userId, password) => {
        try {
            const token = await this.SesioneService_.verify_password(userId, password);
            return token;
        } catch (error) {
            console.error('Error al verificar el token:', error);
            return null;
        }
    }

    public async iniciar_session({ request, response }: HttpContext) {

        let { email, password } = request.only(['email', 'password']);
        email = email.trim().toLowerCase();

        if (!await this.consultar_user_si_esta_habilitado(email)) {
            return response.status(400).send({ 
                message: 'Usuario inhabilitado'
            });
        }

        const user = await this.consultar_user_by_email(email);

        if (!user) {
            return response.status(400).send({ 
                message: 'Usuario o contraseña invalida'
            });
        }

        const userAutorizado = await this.#verify_password(user.id, password);
        if (!userAutorizado) {
            return response.status(401).send({ 
                message: 'Usuario no autorizado'
            });
        }

        const apiToken = await this.#createApiToken(user.id, user.type_id);
        if (!apiToken) {
            return response.status(400).send({ 
                message: 'error en el servidor'
            });
        }

        return response.status(200).json({
            nombre: user.name,
            apellido: user.surname,
            correo: user.email,
            type: user.type_id,
            token: apiToken.token
        });
    
    }

    public async cambiar_contrasena({ request, response }: HttpContext) {
        
        const { email, password } = request.only(['email', 'password']);
        const user = await this.consultar_user_by_email(email.toLowerCase());

        if (!user) {
            return response.status(400).send({ 
                message: 'Usuario o contraseña invalida'
            });
        }

        if (!(await this.SesioneService_.cambiar_contrasena(user.id, password))) {
            return response.status(400).send({ 
                message: 'No se pudo cambiar la contrasena'
            });
        }

        return response.status(200).send({ 
            message: 'Contrasena Actualizada'
        });

    }

}