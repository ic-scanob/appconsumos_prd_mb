/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_Crear_Registrar_Planillas(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user
    return info.rol === 'Técnico' ;
}
