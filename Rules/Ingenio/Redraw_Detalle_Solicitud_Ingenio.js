/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Redraw_Detalle_Solicitud_Ingenio(context) {
    let info_solicitud = context.binding;
    let id_solicitud = info_solicitud.id;
    const pageProxy = context.getPageProxy();
 
    let filtro = `$expand=almacen&$filter=id eq ${id_solicitud}`;
 
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Solicitudes', [], filtro).then(async (results) => {
        if (results && results.length > 0) {
            let solicitud = results.getItem(0)
            if (solicitud.estado == 'Autorizado') {
                info_solicitud.estado = 'Autorizado'
                pageProxy.redraw()
            }else if (solicitud.estado == 'Aprobado' || solicitud.estado == 'Rechazado') {
                info_solicitud.estado = solicitud.estado
                pageProxy.redraw()
            }
 
        }
    })
 
}
