/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function ValidarAutorizar_CampoEquipo(context) {
    const pass = context.evaluateTargetPath("#Page:Autorizar_Solicitud_CampoEquipo/#Control:pass/#Value");

    if (!pass || pass == '') {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Contraseña Requerida",
                "Message": "Falta ingresar la contraseña. Verifícala y vuelve a intentarlo."
            }
        });
    }

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Message": "¿Estás seguro de que deseas autorizar el consumo? Al autorizarlo, generará el movimiento correspondiente en el ERP.",
            "Title": "Autorizar Solicitud",
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Rules/Campo/Equipo/LiquidarSolicitud_CampoEquipo_SAP.js",
            "CancelCaption": "Cancelar" 
        }
    });

}
