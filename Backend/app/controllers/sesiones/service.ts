
import Sesione from '../../models/sesione.js'
import hash from '@adonisjs/core/services/hash'

export default class SesioneService {

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 20 dic 2024
     * @DateUpdate  : 20 dic 2024
     * @Name        : verify_password
     * @details     : Verifica el ID y la contraseña del Usuario
     * @returnTrue  : Retorna Verdadero si la contraseña y el usuario es correcto
     * @returnFalse : Retorna False si la contraseña es invalida
    */

    async verify_password(id: number, password: string): Promise<boolean> {
        
        const response = await Sesione.find(id)
    
        if (!response ) {
            return false;
        }

        if (await hash.verify(response.password, password)) {
            console.log('Logeo exitoso');
            return true;
        }

        console.log('El password es incorrecto.');
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

            const encryptPassword = await hash.make(password);
            const sessionUser = await Sesione.create({
                user_id,
                password: encryptPassword,
            });
            
            return !!sessionUser; // Convertir el resultado a un booleano
        } catch (error) {
            console.error('Error creando usuario en SesioneService:', error.message);
            return false;
        }
    }

}