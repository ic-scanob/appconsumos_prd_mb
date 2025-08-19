/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Confirmar_Componentes_Abast(context) {
    let id_solicitud = context.binding.id
    let filtro = `$expand=material,material/und,almacen&$filter=solicitud_id eq ${id_solicitud} and aprobado eq true`

    return filtro
}
