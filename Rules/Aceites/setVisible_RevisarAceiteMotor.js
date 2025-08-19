/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function setVisible_RevisarAceiteMotor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    //clientDataFiltro.data_planilla_motor.estado
    let info = clientData.info_user;

    return clientDataFiltro.data_planilla_motor.estado === 'Enviado' 
    && (info.rol === 'Auxiliar' || info.rol === 'Autorizador') 
    && clientDataFiltro.data_planilla_motor.total > 0;

    /*let binding = context.binding

    alert(clientDataFiltro.data_planilla_motor.estado)
    return true*/
}
