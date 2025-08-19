/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Detalle_Componentes_Campo(context) {
    let id_solicitud = context.binding.id

     let filtro = `$expand=material($expand=und),almacen&$filter=solicitud_id eq ${id_solicitud}`

    return filtro
}
