/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_Botones_Planillas(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let estado = clientData.data_planilla_motor.estado

    return estado === 'Pendiente'

}
