/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Detalle_Componentes_Abast(context) {
    let id_solicitud = context.binding.id

    let filtro = `$expand=material,material/und,almacen&$filter=solicitud_id eq ${id_solicitud} and material_material ne null`

    return filtro
}
