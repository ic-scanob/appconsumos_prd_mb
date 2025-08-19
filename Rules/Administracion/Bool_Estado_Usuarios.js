/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Bool_Estado_Usuarios(context) {
    try {
        var object = context.binding
        var estado = object.estado
        
        if(estado == "Activo"){
            return true
        }
        if(estado == "Inactivo"){
            return false
        }
    } catch (error) {
        console.error("Ocurrió un error al obtener el valor:", error);
        alert("No se pudo obtener el valor: " + error.message);
    }
}
