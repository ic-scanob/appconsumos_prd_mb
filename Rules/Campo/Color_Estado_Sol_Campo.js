/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Color_Estado_Sol_Campo(context) {
    try {
        var object = context.binding
        var estado = object.estado
        
        if(estado == "Enviado"){
            return "Grey"
        }
        if(estado == "Aprobado"){
            return "Mango"
        }
        if(estado == "Rechazado"){
            return "Red"
        }
        if(estado == "Autorizado"){
            return "Green"
        }
        if(estado == "Tramitado"){
            return "Teal"
        }
    } catch (error) {
        console.error("Ocurrió un error al obtener el valor:", error);
        alert("No se pudo obtener el valor: " + error.message);
    }
}
