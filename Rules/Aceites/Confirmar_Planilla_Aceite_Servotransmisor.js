/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Confirmar_Planilla_Aceite_Servotransmisor(context) {
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Servotransmisor').getClientData();

    let obs = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Servotransmisor/#Control:FormCellNote0/#Value');
    clientDataFiltro.QueryRevisarPlanilla = clientDataFiltro.data_planilla_servotrans.id
    clientDataFiltro.obsRevisarPlanilla = obs
    if(clientData.total != clientData.lista_revision_servotrans.length){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Faltan Consumos",
                "Message": `Completa los consumos marcados como Full para seguir con el proceso.`
            }
        });
    }

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": `Aprobar Planilla`,
            "Message": `¿Estás seguro de que deseas confirmar la planilla No.${clientDataFiltro.data_planilla_servotrans.numero} de Aceite Servotransmisor?`,
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Actions/oData/Update_Planilla_Aceite_Aprobar_Servotransmisor.action",
            "CancelCaption": "Cancelar"
        }
    })
}
