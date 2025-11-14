import type { HttpContext } from '@adonisjs/core/http'

import UserService from './service.js';
import SesioneController from '../sesiones/main.js';
import AdministradorController from '../administrador/main.js';
import EstudianteController from '../estudiante/main.js';
import ProfesorController from '../profesor/main.js';
import TokenController from '../token/main.js';

export default class UsersController {

    private readonly UserService_: UserService;
    private readonly SesioneController_: SesioneController;
    private readonly AdministradorController_: AdministradorController;
    private readonly EstudianteController_: EstudianteController;
    private readonly ProfesorController_: ProfesorController;
    private readonly TokenController_: TokenController;

    constructor() {
        this.UserService_ = new UserService();
        this.SesioneController_ = new SesioneController();
        this.AdministradorController_ = new AdministradorController();
        this.EstudianteController_ = new EstudianteController();
        this.ProfesorController_ = new ProfesorController();
        this.TokenController_ = new TokenController();
    }

    create_user = async (email: string, name: string, surname: string, type_id: number, status_logico: boolean) => {
        return await this.UserService_.crear_usuario(email.toLowerCase(), name, surname, type_id, status_logico)
    }

    delete_user = async (id: number) => {
        return await this.UserService_.eliminar_usuario(id)
    }

    consultar_user_by_email = async (email: string) => {
        return await this.UserService_.consultar_user_by_email(email)
    }

    consultar_user_by_ID = async (id: number) => {
        return await this.UserService_.consultar_user_by_ID(id)
    }

    consultar_user_si_esta_habilitado = async (email: string) => {
        return await this.UserService_.consultar_user_si_esta_habilitado(email)
    }

    public async create_usuario({ request, response }: HttpContext) {

        try {

            const { email, password, name="", surname="", type_id, status_logico=true } = request.only(['email', 'password', 'name', 'surname', 'type_id', 'status_logico'])
            const user = await this.create_user(email, name, surname, type_id, status_logico)
            
            if (!user) {
                return response.status(400).send({ 
                    message: 'Usuario ya existe', 
                    success: false 
                });
            }

            if (!await this.SesioneController_.create_password(user.id, password)) {
                this.delete_user(user.id)
                return response.status(400).send({ 
                    message: 'error en ecriptar la contrasena', 
                    success: false 
                });
            }

            if (type_id === 1) {
                if (!await this.EstudianteController_.create_estudiante(user.id)) {
                    this.delete_user(user.id)
                    return response.status(400).send({ 
                        message: 'error en la creacion del estudiante', 
                        success: false 
                    });
                }
            }

            if (type_id === 2) {
                if (!await this.ProfesorController_.create_profesor(user.id)) {
                    this.delete_user(user.id)
                    return response.status(400).send({ 
                        message: 'error en la creacion del profesor', 
                        success: false 
                    });
                }
            }

            if (type_id === 3) {
                if (!await this.AdministradorController_.create_administrador(user.id)) {
                    this.delete_user(user.id)
                    return response.status(400).send({ 
                        message: 'error en la creacion del administrador', 
                        success: false 
                    });
                }
            }

            return response.status(200).json({
                message: 'Usuario registrado exitosamente',
            });

        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async listar_usuarios({ request, response }: HttpContext) {

        try {
        
            const { type_id } = request.qs();
        
            if (!type_id || isNaN(Number(type_id))) {
                return response.status(400).json({
                    message: 'El parámetro type_id es obligatorio y debe ser un número válido.'
                });
            }

            const user = await this.UserService_.listado_usuarios(type_id);
            
            if (!user || user.length === 0) {
                return response.status(404).json({
                    message: 'No se encontraron usuarios con el type_id proporcionado.'
                });
            }

            return response.status(200).json({
                data: user.map(u => ({
                    ...u.$attributes, // Incluye las propiedades principales (id, email, etc.)
                    ...u.$extras
                }))
            });


        } catch (error) {
            return response.status(500).json({
                message: error
            });
        }

    }

    public async ver_usuario({ params, response }: HttpContext) {
        
        const { email } = params;
        const user = await this.consultar_user_by_email(email);

        if (!user) {
            return response.status(400).send({ 
                message: 'Error en obtener el usuario'
            });
        }

        return response.status(200).json({
            nombre: user.name,
            apellido: user.surname,
            correo: user.email,
            telefono: user.phone,
        });

    }

    public async editar_usuario({ request, response }: HttpContext) {

        const { email, name, surname, phone } = request.only(['email', 'name', 'surname', 'phone'])
        
        if (!await this.UserService_.editar_usuario(email, name, surname, phone)) {
            return response.status(400).send({ 
                message: 'no se pudo actualizar el usuario', 
                success: false 
            });
        }

        return response.status(200).send({ 
            message: 'Usuario actualizado'
        });

    }

    public async habilitar_or_deshabilitar_user({ request, response }: HttpContext) {
        
        try {
            
            const { email } = request.only(['email']);
            const user = await this.consultar_user_by_email(email);
    
            if (!user) {
                return response.status(404).json({
                    message: 'Usuario no encontrado',
                });
            }
    
            user.status_logico = !user.status_logico;
    
            await user.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }

    public async eliminar_usuario({ params, response }: HttpContext) {
        
        try {
            
            const { email } = params;
            const user = await this.consultar_user_by_email(email);
    
            if (!user) {
                return response.status(404).json({
                    message: 'Usuario no encontrado',
                });
            }
    
            user.eliminado = !user.eliminado;
    
            await user.save();

            const respuesta = await this.TokenController_.delete_token_user(user.id);

            if (!respuesta) {
                return response.status(400).json({
                    message: 'No se pudo eliminar el token del usuario',
                });
            }
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }
}
