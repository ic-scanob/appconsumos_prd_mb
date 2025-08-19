/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function isVisible_Btn_HistoricoSolicitudes(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user

    return info.rol === 'Auxiliar' || info.rol === 'Autorizador' || info.rol === 'Técnico';
}
