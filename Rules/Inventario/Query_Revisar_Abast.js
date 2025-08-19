/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Query_Revisar_Abast(context) {
    let id_solicitud = context.binding.id

    let filtro = `$expand=material($expand=und),almacen&$filter=solicitud_id eq ${id_solicitud}`

    return filtro
}
