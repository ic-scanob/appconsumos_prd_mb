/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function set_VisibleBtnAbrirDocumento(context) {
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;
 
   var rol = info.rol === 'Auxiliar' || info.rol === 'Autorizador'
    return estado === 'Autorizado' && rol;
}
