import type { HttpContext } from '@adonisjs/core/http'

import UnidadesController from '../unidades/main.js';
import EvaluacionesService from './service.js';
import SopaDeLetrasController from '../sopa_de_letras/main.js';
import CuestionariosController from '../cuestionarios/main.js';
import PreguntasAbiertasController from '../preguntas_abiertas/main.js';

export default class EvaluacionesController {

    private readonly UnidadesController_: UnidadesController;
    private readonly EvaluacionesService_: EvaluacionesService;
    private readonly SopaDeLetrasController_: SopaDeLetrasController;
    private readonly CuestionariosController_: CuestionariosController;
    private readonly PreguntasAbiertasController_: PreguntasAbiertasController;

    constructor() {
        this.UnidadesController_ = new UnidadesController();
        this.EvaluacionesService_ = new EvaluacionesService();
        this.SopaDeLetrasController_ = new SopaDeLetrasController();
        this.CuestionariosController_ = new CuestionariosController();
        this.PreguntasAbiertasController_ = new PreguntasAbiertasController();
    }

    obtener_evaluaciones_By_Unidad = async (id_unidad: number, status: string = "true") => {
        return await this.EvaluacionesService_.obtenerEvaluacionesByID_Unidad(id_unidad, status);
    }

    delete_evaluacion = async (id: number) => {
        return await this.EvaluacionesService_.eliminar_evaluacion(id)
    }

    public async create_evaluacion({ request, response }: HttpContext) {
        try {
            
            const { id_unidad, type_id, nota_evaluacion} = request.only(['id_unidad', 'type_id', 'nota_evaluacion'])

            const unidad = await this.UnidadesController_.consultar_unidad_by_ID(id_unidad);
            const statusParam = "false";
            const evaluaciones = await this.obtener_evaluaciones_By_Unidad(id_unidad, statusParam);
            let totalNotas = 0;

            if (evaluaciones && evaluaciones.length > 0) {
                totalNotas = evaluaciones.reduce((total, evaluacion) => {
                    const nota = parseFloat(evaluacion.$attributes.nota_evaluacion);
                    return total + (isNaN(nota) ? 0 : nota);
                }, 0);
            }

            if (unidad) {
                const sumaNotas = totalNotas + parseFloat(nota_evaluacion);
                const sumaRedondeada = Math.round(sumaNotas * 100) / 100;
            
                if (sumaRedondeada > unidad.nota_unidad) {
                    return response.status(400).send({ 
                        message: `La nueva evaluación excede el puntaje. Actualmente tiene ${Math.round(totalNotas * 100) / 100} de ${unidad.nota_unidad} puntos`,
                        success: false 
                    });
                }
            }
            
            const evaluacion = await this.EvaluacionesService_.create_evaluacion(id_unidad, type_id, nota_evaluacion)
            
            if (!evaluacion) {
                return response.status(400).send({ 
                    message: 'Error al crear la evaluacion', 
                    success: false 
                });
            }

            if (parseInt(type_id) === 1) {
                const { palabras } = request.only(['palabras'])

                if (!await this.SopaDeLetrasController_.create_SopaDeLetras(evaluacion.id, palabras)) {
                    this.delete_evaluacion(evaluacion.id)
                    return response.status(400).send({ 
                        message: 'error en la de la sopa de letras', 
                        success: false 
                    });
                }
            }

            if (parseInt(type_id) === 2) {
                const { cuestionario } = request.only(['cuestionario']);
            
                for (const item of cuestionario) {
                    const pregunta = item.pregunta;
                    const opciones = item.opciones;
                    const respuesta_correcta = item.respuesta;
            
                    const creado = await this.CuestionariosController_.create_cuestionario(
                        evaluacion.id,
                        pregunta,
                        opciones,
                        respuesta_correcta
                    );
            
                    if (!creado) {
                        await this.delete_evaluacion(evaluacion.id);
                        return response.status(400).send({ 
                            message: 'Error en la creación del cuestionario', 
                            success: false 
                        });
                    }
                }
            }

            if (parseInt(type_id) === 3) {
                const { preguntas } = request.only(['preguntas']);
            
                for (const item of preguntas) {
            
                    const creado = await this.PreguntasAbiertasController_.create_PreguntasAbiertas(
                        evaluacion.id,
                        item,
                    );
            
                    if (!creado) {
                        await this.delete_evaluacion(evaluacion.id);
                        return response.status(400).send({ 
                            message: 'Error en la creación del cuestionario', 
                            success: false 
                        });
                    }
                }
            }
            
            return response.status(200).json({
                message: 'Evaluacion Registrada correctamente',
                data: evaluacion
            });

            
            
        } catch (error) {
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async obtener_evaluacionesByUnidad({ params, response }: HttpContext) {
    
        try {
            const evaluaciones = await this.obtener_evaluaciones_By_Unidad(params.id, params.status);
    
            if (!evaluaciones) {
                return response.status(404).json({ message: 'Unidad no encontrada' });
            }
    
            return response.status(200).json(evaluaciones);
        } catch (error) {
            console.error('Error obteniendo las evaluaciones:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async delete({ params, response }: HttpContext) {
            
        try {
            
            const { id } = params;
            if (!await this.EvaluacionesService_.soft_delete(id)) {
                return response.status(400).send({ 
                    message: 'Error al eliminar la evaluacion', 
                    success: false 
                });
            }
            return response.status(200).send({ message: 'Evaluacion eliminada correctamente',});

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }

    public async habilitar_or_deshabilitar_evaluacion({ request, response }: HttpContext) {
        
        try {
            
            const { id } = request.only(['id']);
            const evaluacion = await this.EvaluacionesService_.obtenerEvaluacionPorID(id);
    
            if (!evaluacion) {
                return response.status(404).json({
                    message: 'Evaluación no encontrado',
                });
            }
    
            evaluacion.status = !evaluacion.status;
    
            await evaluacion.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }


}