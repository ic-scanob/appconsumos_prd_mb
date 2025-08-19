/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function isVisible_Btn_Validar_Registros(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user
    return info.rol === 'Auxiliar' || info.rol === 'Autorizador';
}
