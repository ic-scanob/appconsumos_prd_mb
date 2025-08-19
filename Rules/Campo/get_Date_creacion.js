/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_Date(context) {
    var object = context.binding
    var fecha = object.fecha_creacion
    let fechaFormateada = `Fe. Creación: $(D,${fecha.slice(0,4)}-${fecha.slice(4,6)}-${fecha.slice(6,8)})`;
    return fechaFormateada
}
