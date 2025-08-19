/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Detalle_Componentes_Abast_Nuevo(context) {
    let id_solicitud = context.binding.id

    let filtro = `$expand=almacen&$filter=solicitud_id eq ${id_solicitud} and mat_nuevo ne null`

    return filtro
}
