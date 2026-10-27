/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function getEnabledAutorizar_CampoEquipo(context) {
    let info_solicitud = context.binding;
    let id_solicitud = info_solicitud.id;
    let filtro = `$expand=material,almacen,material/und&$filter=solicitud_id eq ${id_solicitud} and posicion eq s and aprobado eq true`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
        if(results && results.length > 0){
            //alert(JSON.stringify(results))
            return true
        }
        return false
    })


}
