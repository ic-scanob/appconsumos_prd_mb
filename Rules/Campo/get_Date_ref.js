/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_Date_ref(context) {
    var object = context.binding
    var fecha = object.fecha_referencia
    let fechaFormateada = `Fe. Referencia: $(D,${fecha.slice(0,4)}-${fecha.slice(4,6)}-${fecha.slice(6,8)})`;
    return fechaFormateada
}
