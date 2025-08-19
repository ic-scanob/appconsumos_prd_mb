/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Rechazar_Planillas_ClientData_Aceites(context) {
    let page = context.getPageProxy();
    let titulo = page.getName();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();

    if (titulo == "Revisar_Planilla_Aceite_Diferencial") {
        clientDataFiltro.data_planilla_diferencial.estado = 'Rechazada'
    }

    if (titulo == "Revisar_Planilla_Aceite_Hidraulico") {
        clientDataFiltro.data_planilla_hidraulico.estado = 'Rechazada'
    }

    if (titulo == "Revisar_Planilla_Aceite_Reductor") {
        clientDataFiltro.data_planilla_reductor.estado = 'Rechazada'
    }

    if (titulo == "Revisar_Planilla_Aceite_Servotransmisor") {
        clientDataFiltro.data_planilla_servotrans.estado = 'Rechazada'
    }

    if (titulo == "Revisar_Planilla_Aceite_Motor") {
        clientDataFiltro.data_planilla_motor.estado = 'Rechazada'
    }

    return context.executeAction("/appconsumos_mb/Actions/ClosePage.action")

}
