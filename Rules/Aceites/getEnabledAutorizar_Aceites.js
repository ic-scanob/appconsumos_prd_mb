/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function getEnabledAutorizar_Aceites(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData()
    let page = context.getPageProxy();
    let titulo = page.getName();
    let info_solicitud;;

    if (titulo == "Aprobar_Aceite_Motor" ){
        info_solicitud = clientData.data_planilla_motor;
    }
    if (titulo == "Aprobar_Aceite_Diferencial" ){
        info_solicitud = clientData.data_planilla_diferencial;
    }
    if (titulo == "Aprobar_Aceite_Hidraulico" ){
        info_solicitud = clientData.data_planilla_hidraulico;
    }
    if (titulo == "Aprobar_Aceite_Reductor" ){
        info_solicitud = clientData.data_planilla_reductor;
    }
    if (titulo == "Aprobar_Aceite_Servotransmisor" ){
        info_solicitud = clientData.data_planilla_servotrans;
    }
    
    let id_solicitud = info_solicitud.id;
    let filtro = `$filter=planilla_id eq ${id_solicitud} and doc_material eq null`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro).then(async (results) => {
        if(results && results.length > 0){
            return true
        }
        return false
    })

}
