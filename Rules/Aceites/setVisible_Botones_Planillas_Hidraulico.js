/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_Botones_Planillas_Hidraulico(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let estado = clientData.data_planilla_hidraulico.estado

    return estado === 'Pendiente'
}
