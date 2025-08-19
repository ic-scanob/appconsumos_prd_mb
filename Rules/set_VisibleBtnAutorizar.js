/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_VisibleBtnAprobar(context) {
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;

    return estado === 'Aprobado' && info.rol === 'Autorizador';
}
