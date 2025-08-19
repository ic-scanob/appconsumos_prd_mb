/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Color_Estado_Usuarios(context) {
    try {
        var object = context.binding
        var estado = object.estado
        
        if(estado == "Activo"){
            return "Green"
        }
        if(estado == "Inactivo"){
            return "Red"
        }
    } catch (error) {
        console.error("Ocurrió un error al obtener el valor:", error);
        alert("No se pudo obtener el valor: " + error.message);
    }
}
