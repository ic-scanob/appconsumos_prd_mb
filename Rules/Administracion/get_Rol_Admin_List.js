/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_Rol_Admin_List(context) {
    try {
        var object = context.binding
        var rol = object.rol
        var isadmin = object.isAdmin
        
        return isadmin ? rol + " - Admin" : rol;

        
    } catch (error) {
        console.error("Ocurrió un error al obtener el valor:", error);
        alert("No se pudo obtener el valor: " + error.message);
    }
}
