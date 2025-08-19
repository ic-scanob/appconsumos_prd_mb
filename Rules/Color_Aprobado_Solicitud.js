/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Aprobado_Solicitud(context) {
    try {
        var object = context.binding
        var aprobado = object.aprobado
       
        if(aprobado == "Aprobado"){
            return "Green"
        }
        if(aprobado == "Rechazado"){
            return "Red"
        }
    } catch (error) {
        console.error("Ocurrió un error al obtener el valor:", error);
        alert("No se pudo obtener el valor: " + error.message);
    }
    
}
