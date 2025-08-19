/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_VisibleBtnRevisar(context) {
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;
    /* 
      if (estado === 'Enviado' && info.rol === 'Auxiliar') {
        return true;
    } else{
        return false;
    }
    */

    return estado === 'Enviado' && info.rol === 'Auxiliar';

}
