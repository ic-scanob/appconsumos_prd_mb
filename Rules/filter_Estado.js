/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function filter_Estado(context) {
    var object = context.binding
    alert(JSON.stringify(object))
    return ["estado eq Enviado", "estado eq Autorizado"]
}
