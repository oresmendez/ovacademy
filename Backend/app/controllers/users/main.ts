import type { HttpContext } from '@adonisjs/core/http';
import UserService from '../../controllers/users/service.js';
import EstudianteService from '../../controllers/estudiante/service.js';
import SesioneService from '../authentication/service.js';
import TokenService from '../authentication/token.js';

const userService_ = new UserService();
const EstudianteService_ = new EstudianteService();
const SesioneService_ = new SesioneService();
const TokenService_ = new TokenService();

export default class UsersController {

    public async index({ request, response }: HttpContext) {
        
        try {

            // Obtener el parámetro de consulta type_id
            const { type_id } = request.qs();
        
            // Validar si type_id existe y es válido
            if (!type_id || isNaN(Number(type_id))) {
                return response.status(400).json({
                    message: 'El parámetro type_id es obligatorio y debe ser un número válido.'
                });
            }
            
            
            const user = await userService_.listado_usuarios(Number(type_id));
    
            if (!user || user.length === 0) {
                return response.status(404).json({
                    message: 'No se encontraron usuarios con el type_id proporcionado.'
                });
            }

            // Mapeamos los resultados para mover "$extras" al nivel principal
            const mappedUsers = user.map(u => ({
                ...u.$attributes, // Incluye las propiedades principales (id, email, etc.)
                ...u.$extras,     // Incluye las propiedades extras (semestre, habilitado)
            }));
    
            // Si todo es correcto, retornar los usuarios con estado success
            return response.status(200).json({
                data: mappedUsers,
            });
    
        } catch (error) {
            // Manejo de errores inesperados
            console.error(error);
            return response.status(500).json({
                message: error
            });
        }
    }
    // ver un usuario
    public async show(ctx: HttpContext): Promise<void> {
        
        const { response } = ctx;

        try {

            
            const userAuthorized = await TokenService_.verifyToken(ctx);
    
            if (userAuthorized && userAuthorized.user_id !== undefined) {
                
                const user = await userService_.show('id', userAuthorized.user_id);
                
                if (!user) {
                    console.log('error en obtener el token');
                    return response.status(400).send({ 
                        message: 'error en el servidor', 
                        success: false 
                    });
                }
    
                return response.ok({
                    success: true,
                    nombre: user.name,
                    apellido: user.surname,
                    telefono: user.phone,
                    correo: user.email,
                });
    
            } else {
                
                return response.status(401).json({
                    success: false,
                    message: 'Token no válido o no autorizado.',
                });
            }
        } catch (error) {
            
            console.error('Error en UsersController.show:', error);
    
            return response.status(500).json({
                success: false,
                message: 'Ocurrió un error interno en el servidor.',
            });
        }
    }

    public async show_id(ctx: HttpContext): Promise<void> {
    
        const { params, response } = ctx;

        try {
              
            const user = await userService_.show('id', params.id);
            
            if (!user) {
                console.log('error en obtener el token');
                return response.status(400).send({ 
                    message: 'error en el servidor', 
                    success: false 
                });
            }

            return response.ok({
                success: true,
                nombre: user.name,
                apellido: user.surname,
                telefono: user.phone,
                correo: user.email,
            });
    
            
        } catch (error) {
            
            console.error('Error en UsersController.show:', error);
    
            return response.status(500).json({
                success: false,
                message: 'Ocurrió un error interno en el servidor.',
            });
        }
    }

    // guardar un usuario

    public async store({ request, response }: HttpContext) {
    
        try {
            
            const { email, type_id, password } = request.only([
                'email',  
                'password',
                'type_id'
            ]);
    
            const user = await userService_.store(email, type_id);
    
            if (!user) {
                console.log('error al crear el usuario');
                return response.status(409).send({ 
                    message: 'Usuario ya existe', 
                    success: false 
                });
            }

            if (type_id === 1) {

                const respRegistrarEstudiante = await EstudianteService_.store(user.id);

                if (!respRegistrarEstudiante) {
                    console.log('error al crear el estudiante');
                    return response.status(400).send({ 
                        message: 'Error al crear al estudiante', 
                        success: false 
                    });
                }

            }
                
            const respRegistroSession = await SesioneService_.store(user.id, password);
    
            if (!respRegistroSession) {
                console.log('error al crear el usuario en la tabla session');
                return response.status(400).send({ 
                    message: 'error en el servidor', 
                    success: false 
                });
            }
    
            return response.ok({
                success: true
            });
    
        } catch (error) {
            console.log('Error en UsersController.store:', error.message);
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }
    
    // editar un usuario
    public async edit({ request, response }: HttpContext) {
        try {
            
            const { email, name, surname, phone, semestre } = request.only(['email', 'name', 'surname', 'phone', 'semestre']);
            const user = await userService_.edit(email);
            
            if (!user) {
                return response.status(404).json({
                    message: 'Usuario no encontrado',
                    success: false,
                });
            }
            
            try {

                user.merge({ name, surname, phone });
                await user.save();

                try{

                    const estudiante = await EstudianteService_.edit(user.id);

                    if (!estudiante) {
                        return response.status(404).json({
                            message: 'Estudiante no encontrado',
                            success: false,
                        });
                    }

                    estudiante.merge({ semestre });
                    await estudiante.save();

                    return response.status(200).json({
                        message: 'Usuario actualizado con éxito',
                        data: user,
                    });

                }catch{
                    
                }
    
    
            } catch (saveError) {
                console.error(`Error al guardar el usuario: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios del usuario',
                    success: false,
                    error: saveError.message,
                });
            }
    
        } catch (error) {
            console.error(`Error en edit: ${error.message}`);
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false,
                error: error.message,
            });
        }
    }

    public async habilitarEstudiante({ request, response }: HttpContext) {

        try {
            const { id } = request.only(['id']);

            console.log(id)

            const estudiante = await EstudianteService_.edit(id);

            if (!estudiante) {
                return response.status(404).json({
                    message: 'Estudiante no encontrado',
                    success: false,
                });
            }

            estudiante.habilitado = !estudiante.habilitado;

            await estudiante.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }

    }
    
    public async delete({ request, response }: HttpContext) {
        try {
            const { email } = request.only(['email']);
            console.log(email);
            const user = await userService_.show('email', email);
    
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
    
    
}
