/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Rechazar_Planilla_Aceite_Hidraulico(context) {
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Hidraulico').getClientData();

    let obs = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Hidraulico/#Control:FormCellNote0/#Value');
    clientDataFiltro.QueryRevisarPlanilla = clientDataFiltro.data_planilla_hidraulico.id
    clientDataFiltro.obsRevisarPlanilla = obs

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": `Rechazar Planilla`,
            "Message": `¿Estás seguro de que deseas rechazar la planilla No.${clientDataFiltro.data_planilla_hidraulico.numero} de Aceite Hidraulico?`,
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Actions/oData/Update_Planilla_Aceite_Rechazar_Hidraulico.action",
            "CancelCaption": "Cancelar"
        }
    })
}
