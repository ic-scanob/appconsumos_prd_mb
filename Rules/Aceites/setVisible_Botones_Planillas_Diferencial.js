/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_Botones_Planillas_Diferencial(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let estado = clientData.data_planilla_diferencial.estado

    return estado === 'Pendiente'
}
