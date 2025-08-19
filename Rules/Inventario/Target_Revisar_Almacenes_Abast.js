/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Target_Revisar_Almacenes_Abast(context) {

    let clientData = context.evaluateTargetPathForAPI('#Page:Revision_Solicitud_Reabastecimiento').getClientData();

    return clientData.infoMaterial
}
