/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function ValidarLiquidar_Campo(context) {

    let clientData = context.evaluateTargetPathForAPI('#Page:Autorizar_Solicitud_Campo').getClientData();
    const signatureObject = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Campo/#Control:FormCellInlineSignatureCapture0/#Value");
    const pass = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Campo/#Control:pass/#Value");
    //clientData.b64Data = ""

    if (!pass || pass == '') {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Contraseña Requerida",
                "Message": "Falta ingresar la contraseña. Verifícala y vuelve a intentarlo."
            }
        });
    }

    if (!signatureObject) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Pendiente por firmar",
                "Message": "La firma es obligatoria para continuar. Asegúrate de presionar “Save/Guardar” para registrar correctamente tu firma."
            }
        });
    }


    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Message": "¿Estás seguro de que deseas liquidar la solicitud? Se relizara la liquidación del material en SAP",
            "Title": "Autorizar Solicitud",
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Rules/Campo/LiquidarSolicitud_Campo_SAP.js",
            "CancelCaption": "Cancelar"
        }
    });
}
