/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_VisibleBtnAutorizar_Aceites(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData()
    let info = clientData.info_user;

    let page = context.getPageProxy();
    let titulo = page.getName();
    let info_solicitud;

    if (titulo == "Detalle_Aceite_Motor" ){
        info_solicitud = clientDataFiltro.data_planilla_motor;
    }
    if (titulo == "Detalle_Aceite_Diferencial" ){
        info_solicitud = clientDataFiltro.data_planilla_diferencial;
    }
    if (titulo == "Detalle_Aceite_Hidraulico" ){
        info_solicitud = clientDataFiltro.data_planilla_hidraulico;
    }
    if (titulo == "Detalle_Aceite_Reductor" ){
        info_solicitud = clientDataFiltro.data_planilla_reductor;
    }
    if (titulo == "Detalle_Aceite_Servotransmisor" ){
        info_solicitud = clientDataFiltro.data_planilla_servotrans;
    }
    
    let id_solicitud = info_solicitud.id;

    let estado = info_solicitud.estado
    let filtro = `$filter=planilla_id eq ${id_solicitud} and doc_material eq null`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro).then(async (results) => {
        if(results && results.length > 0){
            if (estado === 'Aprobada' && (info.rol === 'Autorizador' || info.rol === 'Auxiliar')){
                return true
            }
        }
        return false
    }) 
}
