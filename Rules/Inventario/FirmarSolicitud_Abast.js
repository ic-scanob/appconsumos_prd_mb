//import logo_pro from '../..Images/logo_pro.png';
import Rule_openDocumentoAnd from '../Rule_openDocumentoAnd.js';
import Rule_openDocumentoIOS from '../Rule_openDocumentoIOS.js';
import get_FechaHoraCol from '../get_FechaHoraCol.js';

/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function FirmarSolicitud_Abast(context) {

    let clientDataAutorizar = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
    //Logo
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info_user = clientData.info_user
    let user = info_user.nombre
    let ficha = info_user.ficha
    let sociedad = info_user.sociedad
    let BindingData = context.binding
    let almacen = BindingData.almacen.almacen_desc
    let sender_email = context.getGlobalDefinition('/appconsumos_mb/Globals/sender_user_email.global');
    const correo_enviar = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Reabastecimiento/#Control:correo_enviar/#Value");
    const correo_enviar_aux = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Reabastecimiento/#Control:correo_enviar_aux/#Value");
    let logo;
    if (sociedad == 'AI08') {
        let logo_pro = context.getGlobalDefinition('/appconsumos_mb/Globals/logo_pro.global');
        logo = logo_pro.getValue()
    }

    if (sociedad == 'AI01') {
        let logo_inc = context.getGlobalDefinition('/appconsumos_mb/Globals/logo_inc.global');
        logo = logo_inc.getValue()
    }

    //firma 
    //const pageProxy = context.getPageProxy();
    const platform = context.nativescript.platformModule;
    const signatureObject = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Reabastecimiento/#Control:FormCellInlineSignatureCapture0/#Value");
    let signatureContent;
    let tipo;

    if (platform.isAndroid) {
        signatureContent = android.util.Base64.encodeToString(signatureObject.content, android.util.Base64.DEFAULT);
        tipo = "And"
    } else if (platform.isIOS) {
        signatureContent = signatureObject.content.base64Encoding();
        tipo = "IOS"
    }


    function sendEmail(pdf) {
        const enviar = (correo) => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_Sendmail.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Enviando correos ...",
                    "OnFailure": "",
                    "OnSuccess": "",
                    "Target": {
                        "Service": "/appconsumos_mb/Services/backend_REST.service",
                        "Path": "/sendmail",
                        "RequestProperties": {
                            "Method": "POST",
                            "Body": {
                                "to": correo,
                                "subject": "PDF Abastecimiento - Salida",
                                "body": `Adjunto PDF salida de materiales desde aplicación Abastecimiento.`,
                                "nombre": "salida_campo.pdf",
                                "adj": `${pdf}`
                            }
                        }
                    }
                }
            });
        };

        // Enviar al primer correo
        return enviar(correo_enviar)
            .then(() => {
                // Si existe el segundo correo, enviar también
                if (correo_enviar_aux) {
                    return enviar(correo_enviar_aux);
                }
            });
    }



    const reqdata = {
        fecha: get_FechaHoraCol(),
        pEntrega: "",
        pEntregaficha: "",
        pAutoriza: user,
        pAutorizaficha: ficha
    }

    //items de la solicitud
    const datajson = []
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], `$expand=material,almacen&$filter=solicitud_id eq ${BindingData.id}`).then(async (results) => {
        if (results && results.length > 0) {
            results.forEach(e => {
                let sap = ""
                let desc = ""
                if (typeof e.mat_nuevo_desc === 'string') {
                    sap = e.mat_nuevo
                    desc = e.mat_nuevo_desc
                }
                //alert(JSON.stringify(e))
                if (typeof e.material_material === 'string') {
                    sap = e.material_material
                    desc = e.material.material_desc
                }
                if (e.aprobado) {
                    datajson.push({
                        alce: almacen,
                        sap: sap.replace(/^0+/, ''),
                        desc: desc,
                        cant: String(e.cantidad_aprobada),
                        um: ""
                    })
                }
            });

            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_generatePDF.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando datos ...",
                    "OnFailure": "",
                    "OnSuccess": "",
                    "Target": {
                        "Service": "/appconsumos_mb/Services/backend_REST.service",
                        "Path": "/generatePDF",
                        "RequestProperties": {
                            "Method": "POST",
                            "Body": {
                                "data": reqdata,
                                "image": `${signatureContent}`,
                                "items": datajson,
                                "logo": `${logo}`,
                                "tipo": tipo
                            },

                        }
                    }
                }
            }).then((result) => {
                if (result && result.data) {
                    let iserror = false

                    //context.b64Data = result.data.value
                    clientDataAutorizar.b64Data = result.data.value
                    return sendEmail(result.data.value)
                        .catch((error) => {
                            iserror = true
                            alert(`Error al enviar correo - ${error}`)
                            return;
                            /*return context.executeAction({
                                "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
                                "Properties": {
                                    "Message": `Error al enviar correo - ${error?.error?.message}`,
                                    "Duration": 2
                                }
                            });*/
                        })
                        .then((result) => {

                            if (!iserror) {
                                context.executeAction({
                                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                                    "Properties": {
                                        "Title": "Correo enviado exitosamente",
                                        "Message": "La orden de salida fue enviada correctamente al correo.",
                                        "OKCaption": "Aceptar"
                                    }
                                });
                            }

                            // Este bloque se ejecutará tanto si sendEmail fue exitoso como si falló
                            if (platform.isAndroid) {
                                return context.executeAction({
                                    "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                                    "Properties": {
                                        "NavigateBackToPage": "Detalle_Solicitud_Reabastecimieto",
                                    }
                                }).then(() => {
                                    return new Promise((resolve) => setTimeout(resolve, 500));
                                }).then(() => {
                                    try {
                                        return Rule_openDocumentoAnd(context);
                                    } catch (errorOpen) {
                                        alert("Error al abrir documento en Android:\n" + (errorOpen.message || errorOpen));
                                    }
                                }).catch((errorClose) => {
                                    alert("Error al cerrar modal:\n" + (errorClose.message || errorClose));
                                });
                            } else if (platform.isIOS) {
                                return context.executeAction({
                                    "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                                    "Properties": {
                                        "NavigateBackToPage": "Detalle_Solicitud_Reabastecimieto"
                                    }
                                }).then(() => {
                                    setTimeout(() => {
                                        try {
                                            return Rule_openDocumentoIOS(context)
                                        } catch (errorOpen) {
                                            alert("Error al abrir documento en IOS:\n" + (errorOpen.message || errorOpen));
                                        }
                                    }, 500);
                                }).catch((errorClose) => {
                                    alert("Error al cerrar modal:\n" + (errorClose.message || errorClose));
                                });
                            }
                        });
                }

            }).catch((error) => {
                alert(error)
            });
        }
    }).catch((error) => {

        alert(`Error ${error.message}`)
    });

}
