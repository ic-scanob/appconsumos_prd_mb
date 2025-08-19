/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Pos_Orden_Aceites(context) {
    //Revisar_Planilla_Aceite_Motor
    let page = context.getPageProxy();
    let titulo = page.getName();
    let clientDataFiltro;

    if (titulo == "Revisar_Planilla_Aceite_Motor") {
        clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Motor').getClientData();
    }
    if (titulo == "Revisar_Planilla_Aceite_Diferencial") {
        clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Diferencial').getClientData();
    }
    if (titulo == "Revisar_Planilla_Aceite_Hidraulico") {
        clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Hidraulico').getClientData();
    }
    if (titulo == "Revisar_Planilla_Aceite_Reductor") {
        clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Reductor').getClientData();
    }
    if (titulo == "Revisar_Planilla_Aceite_Servotransmisor") {
        clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Servotransmisor').getClientData();
    }

    let materiales = clientDataFiltro.materiales_lista
    return materiales
}
