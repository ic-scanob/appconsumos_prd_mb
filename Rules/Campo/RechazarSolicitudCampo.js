/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function RechazarSolicitudCampo(context) {

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": "Confirmación",
            "Message": "¿Estás seguro de que deseas rechazar la solicitud completa? Todos los materiales serán rechazados.",
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Rechazar_Campo.action",
            "CancelCaption": "Cancelar"
        }
    })

}
