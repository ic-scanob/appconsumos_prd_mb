/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_VisibleBtnNetear(context) {
    //Esta regla se usa en el boton de Salida en abastecimiento, en Netear en Ingenio, y en liquidar en Campo
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;

    //return estado === 'Autorizado' && info.rol === 'Auxiliar';
    return false
}
