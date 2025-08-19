/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function getEnabledLiquidar_Campo(context) {

    //primero validar que todas los componentes de la solicitud ya tengan posiciones
    //para que sea true validar si hay componentes con doc_material null
    let info_solicitud = context.binding;
    let id_solicitud = info_solicitud.id;
    let filtro = `$expand=material,almacen,material/und&$filter=solicitud_id eq ${id_solicitud} and posicion eq null and aprobado eq true`;
    let filtro2 = `$expand=material,almacen,material/und&$filter=solicitud_id eq ${id_solicitud} and posicion ne null and aprobado eq true and doc_material eq null`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
        if (results && results.length > 0) {
            return false
        } else {
            return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro2).then(async (results) => {
                if (results && results.length > 0) {
                    return true
                }
                return false
            })
        }
    })
}
