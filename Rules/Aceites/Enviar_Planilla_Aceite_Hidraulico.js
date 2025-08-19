/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Enviar_Planilla_Aceite_Hidraulico(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_hidraulico.id;
    let filtro = `$filter=planilla_id eq ${id_planilla}`;
 
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro).then(async (results) => {
        //si hay items en la planilla
        if (results && results.length > 0) {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Confirmación",
                    "Message": "¿Está seguro que desea enviar la planilla?",
                    "OKCaption": "Aceptar",
                    "OnOK": "/appconsumos_mb/Actions/oData/Update_Planilla_Aceite_Hidraulico.action",
                    "CancelCaption": "Cancelar"
                }
            });
        } else {
            //Si no hay items en la planilla
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Confirmación",
                    "Message": "¿Está seguro que desea enviar la planilla sin ítems registrados?",
                    "OKCaption": "Aceptar",
                    "OnOK": "/appconsumos_mb/Actions/oData/Update_Planilla_Aceite_Hidraulico.action",
                    "CancelCaption": "Cancelar"
                }
            });
        }
    }).catch((error) => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Error",
                "Message": `Error al consultar datos: ${error.message}`,
                "OKCaption": "Cerrar"
            }
        });
    });
}
