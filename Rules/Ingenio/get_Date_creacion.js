/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Date_creacion(context) {
    var object = context.binding
    var fecha = object.fecha_creacion
    let fechaFormateada = `Fe. Creación: $(D,${fecha.slice(0,4)}-${fecha.slice(4,6)}-${fecha.slice(6,8)})`;
    return fechaFormateada
}
