/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function set_VisibleBtnConfirmar(context) {
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;

    return estado === 'Autorizado' && info.rol === 'Técnico';
}
