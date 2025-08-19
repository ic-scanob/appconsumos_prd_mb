/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_RevisarAceiteServotransmisor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    //clientDataFiltro.data_planilla_servotrans.estado
    let info = clientData.info_user;

    return clientDataFiltro.data_planilla_servotrans.estado === 'Enviado' 
    && (info.rol === 'Auxiliar' || info.rol === 'Autorizador') 
    && clientDataFiltro.data_planilla_servotrans.total > 0;

}
