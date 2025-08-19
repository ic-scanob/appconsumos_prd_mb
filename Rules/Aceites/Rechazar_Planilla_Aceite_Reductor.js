/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Rechazar_Planilla_Aceite_Reductor(context) {
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Reductor').getClientData();

    let obs = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Reductor/#Control:FormCellNote0/#Value');
    clientDataFiltro.QueryRevisarPlanilla = clientDataFiltro.data_planilla_reductor.id
    clientDataFiltro.obsRevisarPlanilla = obs

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": `Rechazar Planilla`,
            "Message": `¿Estás seguro de que deseas rechazar la planilla No.${clientDataFiltro.data_planilla_reductor.numero} de Aceite Reductor?`,
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Actions/oData/Update_Planilla_Aceite_Rechazar_Reductor.action",
            "CancelCaption": "Cancelar"
        }
    })

}
