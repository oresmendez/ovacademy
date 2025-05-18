
import type { HttpContext } from '@adonisjs/core/http'
import UnidadService from '../../controllers/unidades/service.js'
import TokenController from '../token/main.js';
import SemestreProfesorAulaController from '../semestre_profesor_aula/main.js';
import EstudianteAulaController from '../estudiante_aula/main.js';

export default class UnidadesController {

    private readonly UnidadService_: UnidadService;
    private readonly TokenController_: TokenController;
    private readonly SemestreProfesorAulaController_: SemestreProfesorAulaController;
    private readonly EstudianteAulaController_: EstudianteAulaController;
    private user_id: number | null = null;

    constructor() {
        this.user_id = null;
        this.UnidadService_ = new UnidadService();
        this.TokenController_ = new TokenController();
        this.SemestreProfesorAulaController_ = new SemestreProfesorAulaController();
        this.EstudianteAulaController_ = new EstudianteAulaController();
    }

    private readonly consultar_unidades_by_user = async (user_id: number) => {
        return await this.UnidadService_.obtenerUnidades(user_id);
    }

    readonly consultar_unidad_by_ID = async (unidad_id: number) => {
        return await this.UnidadService_.obtenerUnidadesByID(unidad_id);
    }

    public async create_unidad(ctx: HttpContext) {  
        
        const { request, response } = ctx;
        
        try {

            this.user_id = await this.TokenController_.get_user_id_by_token(ctx);
            if (!this.user_id) return; 
            
            const unidades = await this.consultar_unidades_by_user(this.user_id);
            let totalNotas = 0;

            if (unidades && unidades.length > 0) {
                totalNotas = unidades.reduce((total, unidad) => {
                    const datos = unidad.toJSON(); 
                    return total + parseFloat(datos.notaUnidad);
                }, 0);
            } 

            const { modulo, nombre, descripcion, nota_unidad } = request.only(['modulo', 'nombre', 'descripcion', 'nota_unidad'])            
            
            if(totalNotas + parseFloat(nota_unidad) > 10){
                return response.status(400).send({ 
                    message: 'La nueva nota excede la cantidad de 10 puntos', 
                    success: false 
                });
            }
            
            
            if (!await this.UnidadService_.crear_unidad(modulo, nombre, descripcion, this.user_id, nota_unidad)) {
                return response.status(400).send({ 
                    message: 'Error al crear la unidad', 
                    success: false 
                });
            }

            return response.status(200).json({
                message: 'unidad creada'
            });
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor', error,
                success: false
            });
        }
    }

    public async get_unidades_by_profesor(ctx: HttpContext) {

        const { response } = ctx;
    
        try {

            this.user_id = await this.TokenController_.get_user_id_by_token(ctx);
            if (!this.user_id) return; 

            const unidades = await this.consultar_unidades_by_user(this.user_id);
    
            if (!unidades) {
                return response.status(400).send({ 
                    message: 'Error al obtener las unidades', 
                    success: false 
                });
            }
    
            return response.status(200).json({
                message: 'listado de unidades',
                data: unidades
            });
            
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async get_unidades_by_estudiante(ctx: HttpContext) {

        const { response } = ctx;
    
        try {

            this.user_id = await this.TokenController_.get_user_id_by_token(ctx);
            if (!this.user_id) return; 

            const Aula_estudiante = await this.EstudianteAulaController_.consultar_aula_by_estudiante(this.user_id);

            let Aula_profesor;
            if (Aula_estudiante) {
                Aula_profesor = await this.SemestreProfesorAulaController_.obtener_datos_aula(
                    Aula_estudiante.semestre_profesor_aula_id
                );
            }

            const unidades = await this.UnidadService_.obtenerUnidades(Aula_profesor.profesor_id);
    
            if (!unidades) {
                return response.status(400).send({ 
                    message: 'Error al obtener las unidades', 
                    success: false 
                });
            }
    
            return response.status(200).json({
                message: 'listado de unidades',
                data: unidades
            });
            
            
        } catch (error) {
            return response.status(500).json({
                message: error.message,
                success: false
            });
        }
    }

    public async get_UnidadById({ params, response }: HttpContext) {

        try {

            const unidad = await this.consultar_unidad_by_ID(params.id);
    
            if (!unidad) {
                return response.status(404).json({ message: 'Unidad no encontrada' });
            }
    
            return response.status(200).json({
                message: '',
                data: unidad
            });
        } catch (error) {
            console.error('Error obteniendo la unidad:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_unidad_by_Id(ctx: HttpContext) {

        const { request, response } = ctx;

        try {
            
            const { id, modulo, nombre, nota_unidad, descripcion } = request.only(['id', 'modulo', 'nombre', 'nota_unidad', 'descripcion']);
            
            const unidad = await this.UnidadService_.obtenerUnidadesByID(id);
    
            if (!unidad) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                });
            }
            
            try {
                unidad.merge({ id, modulo, nombre, nota_unidad, descripcion });
                await unidad.save();
    
                return response.status(200).json({
                    message: 'Unidad actualizada con éxito',
                    data: unidad,
                });
    
            } catch (saveError) {
                console.error(`Error al guardar la Unidad: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios de la Unidad',
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

    public async habilitar_or_deshabilitar_unidad({ params, response }: HttpContext) {
        
        try {
            
            const unidad = await this.UnidadService_.obtenerUnidadesByID(params.id);
    
            if (!unidad) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                });
            }
    
            unidad.status = !unidad.status
    
            await unidad.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }
    

}
