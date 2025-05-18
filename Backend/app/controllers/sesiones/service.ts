
import Sesione from '../../models/authentication/sesione.js'
import hash from '@adonisjs/core/services/hash'

export default class SesioneService {

    private readonly sesioneModel = Sesione;
    private readonly hashModel = hash;

    async verify_password(id: number, password: string): Promise<boolean> {
        
        const response = await this.sesioneModel.find(id)
    
        if (!response ) {
            return false;
        }

        if (await hash.verify(response.password, password)) {

            return true;
        }

        return false;       

    } 
    
    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 21 dic 2024
     * @DateUpdate  : 21 dic 2024
     * @Name        : store
     * @details     : Guarda el ID y la contraseña en la tabla session
     * @returnTrue  : Retorna Verdadero si el registro es exitoso
     * @returnFalse : Retorna False si fallo el registro
    */

    async store(user_id: number, password: string): Promise<boolean> {
        
        try {

            const encryptPassword = await this.hashModel.make(password);
            const sessionUser = await this.sesioneModel.create({
                user_id,
                password: encryptPassword,
            });
            
            return !!sessionUser; // Convertir el resultado a un booleano
        } catch (error) {
            console.error('Error creando usuario en SesioneService:', error.message);
            return false;
        }
    }

    async cambiar_contrasena(id: number, password: string): Promise<boolean> {
        
        try {
            const user = await this.sesioneModel.find(id)
        
            if (!user ) {
                return false;
            }
    
            const encryptPassword = await hash.make(password);
            user.password = encryptPassword
            await user.save()
            return true
            
        } catch (error) {
            console.error('Error cambiando la contrasena en SesioneService:', error.message);
            return false;
        }
    }

}