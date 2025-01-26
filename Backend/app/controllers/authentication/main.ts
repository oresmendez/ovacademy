import type { HttpContext } from '@adonisjs/core/http'
import SesioneService from './service.js'
import UserService from '../users/service.js';
import TokenService from './token.js';

const SesioneService_ = new SesioneService();
const UserService_ = new UserService();
const TokenService_ = new TokenService();

export default class SesioneController {

    #createApiToken = async (userId, userTypeId) => {
        try {
            const token = await TokenService_.create(userId, userTypeId);
            return token;
        } catch (error) {
            console.error('Error al crear el token:', error);
            return null;
        }
    }

    #verify_password = async (userId, password) => {
        try {
            const token = await SesioneService_.verify_password(userId, password);
            return token;
        } catch (error) {
            console.error('Error al verificar el token:', error);
            return null;
        }
    }
    
    public async authorize({ request, response }: HttpContext) {
    
        const { email, password, access } = request.only(['email', 'password', 'access']);
        const user = await UserService_.show('email', email);
    
        if (!user) {
            console.log('El usuario no existe');
            return response.status(404).send({ 
                message: 'Usuario o contraseña invalida'
            });
        }
    
        const userAutorizado = await this.#verify_password(user.id, password);
    
        if (!userAutorizado) {
            console.log('contraseña no aceptada');
            return response.status(401).send({ 
                message: 'Usuario no autorizado'
            });
        }
    
        if(access != user.type_id){
            return response.status(401).send({ 
                message: 'Usuario no autorizado'
            });
        }
        
        const apiToken = await this.#createApiToken(user.id, user.type_id);
    
        if (!apiToken) {
            console.log('error al crear el token');
            return response.status(400).send({ 
                message: 'error en el servidor'
            });
        }
    
        return response.ok({
            nombre: user.name,
            apellido: user.surname,
            correo: user.email,
            type: user.type_id,
            token: apiToken.token
        });
    
    }

    public async store(user_id: number, password: string): Promise<boolean> {
        
        try {
            if (!user_id || !password) {
                console.log('Usuario y password son requeridos');
                return false;
            }
    
            const registerSession = await SesioneService_.store(user_id, password);
    
            if (registerSession) {
                console.log('Registro en sesión creado');
                return true;
            }
    
            console.log('No se pudo crear la sesión del usuario');
            return false;
    
        } catch (error) {
            console.log('Error en SesioneController.store:', error.message);
            return false;
        }
    }
}
