/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function ValidarAutorizar_Aceites(context) {    

    let page = context.getPageProxy();
    let titulo = page.getName();
    let pass;

    if (titulo == "Aprobar_Aceite_Motor" ){
        pass = context.evaluateTargetPath("#Page:Aprobar_Aceite_Motor/#Control:pass/#Value")
    }
    if (titulo == "Aprobar_Aceite_Diferencial" ){
        pass = context.evaluateTargetPath("#Page:Aprobar_Aceite_Diferencial/#Control:pass/#Value")
    }
    if (titulo == "Aprobar_Aceite_Hidraulico" ){
        pass = context.evaluateTargetPath("#Page:Aprobar_Aceite_Hidraulico/#Control:pass/#Value")
    }
    if (titulo == "Aprobar_Aceite_Reductor" ){
        pass = context.evaluateTargetPath("#Page:Aprobar_Aceite_Reductor/#Control:pass/#Value")
    }
    if (titulo == "Aprobar_Aceite_Servotransmisor" ){
        pass = context.evaluateTargetPath("#Page:Aprobar_Aceite_Servotransmisor/#Control:pass/#Value")
    }
    
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
            "Message": "¿Estás seguro de que deseas autorizar la planilla? Al autorizarla, generará el movimiento correspondiente en el ERP.",
            "Title": "Autorizar Solicitud",
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Rules/Aceites/LiquidarSolicitud_Aceites_SAP.js",
            "CancelCaption": "Cancelar"
        }
    });
}
