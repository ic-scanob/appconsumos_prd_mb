/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Materiales_Solicitud_Ingenio(context) {
    let id_solicitud = context.binding.id

    let filtro = `$expand=material,almacen&$filter=solicitud_id eq ${id_solicitud}`

    return filtro
}
