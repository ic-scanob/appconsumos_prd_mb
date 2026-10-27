/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_VisibleBtnRechazarEquipo(context) {
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;
    //let valor = object.orden;

    //return estado === 'Aprobado' && info.rol === 'Autorizador' && (!valor);
    return estado === 'Aprobado' && info.rol === 'Autorizador';
}
