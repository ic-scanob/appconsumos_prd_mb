/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Color_Aceites_Tipo(context) {
    try {
        var object = context.binding
        var tipo = object.tipo
       
        if(tipo == "Cambio"){
            return "Mango"
        }
        if(tipo == "Full"){
            return "Blue"
        }
    } catch (error) {
        alert("No se pudo obtener el valor: " + error.message);
    }
}
