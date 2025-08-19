/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function ValidarAutorizar_Ingenio(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Autorizar_Solicitud_Ingenio').getClientData();
    const signatureObject = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:FormCellInlineSignatureCapture0/#Value");
    const pass = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:pass/#Value");
    const correo_enviar = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:correo_enviar/#Value");
    const correo_enviar_aux = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:correo_enviar_aux/#Value");


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

    if (!correo_enviar || correo_enviar.trim() === '') {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Correo Requerido",
                "Message": "Falta ingresar el correo. Verifícalo y vuelve a intentarlo."
            }
        });
    }
    
    // Validación de formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo_enviar)) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Correo Inválido Autorizador",
                "Message": "El correo ingresado no es válido. Verifícalo e inténtalo de nuevo."
            }
        });
    }

    if (!regexCorreo.test(correo_enviar_aux)) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Correo Inválido Auxiliar",
                "Message": "El correo ingresado no es válido. Verifícalo e inténtalo de nuevo."
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
            "Message": "¿Estás seguro de que deseas autorizar la solicitud? Al autorizarla, los componentes se enviarán a la reserva.",
            "Title": "Autorizar Solicitud",
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Rules/Ingenio/ProcesarSolicitud_Ingenio_SAP.js",
            "CancelCaption": "Cancelar"
        }
    });
}
