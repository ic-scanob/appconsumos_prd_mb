/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function isVisible_Btn_CrearSolicitudes(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user

    return info.rol === 'Técnico';
}
