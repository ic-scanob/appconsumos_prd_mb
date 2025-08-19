/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_Botones_Planillas_Reductor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let estado = clientData.data_planilla_reductor.estado

    return estado === 'Pendiente'

}
