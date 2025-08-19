/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function isVisible_Btn_CrearSolicitudes(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user

    return info.rol === 'Técnico';

}
