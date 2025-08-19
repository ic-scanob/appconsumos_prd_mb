import Rule_openDocumentoAnd from '../Rule_openDocumentoAnd.js';
import Rule_openDocumentoIOS from '../Rule_openDocumentoIOS.js';
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default async function PDF_Ingenio(context) {
    const platform = context.nativescript.platformModule;

    let sender_email = context.getGlobalDefinition('/appconsumos_mb/Globals/sender_user_email.global');
    const signatureObject = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:FormCellInlineSignatureCapture0/#Value");
    const correo_enviar = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:correo_enviar/#Value");
    const correo_enviar_aux = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:correo_enviar_aux/#Value");

    let signatureContent;
    let tipo;

    if (platform.isAndroid) {
        signatureContent = android.util.Base64.encodeToString(signatureObject.content, android.util.Base64.DEFAULT);
        tipo = "And"
    } else if (platform.isIOS) {
        signatureContent = signatureObject.content.base64Encoding();
        tipo = "IOS"
    }

    const info_solicitud = context.binding;
    const orden = info_solicitud.orden;
    const reserva = info_solicitud.reserva;

    try {
        const res = await context.executeAction({
            "Name": "/appconsumos_mb/Actions/Call_ZAMMST_RESERVASet.action",
            "Properties": {
                "ShowActivityIndicator": true,
                "ActivityIndicatorText": "Cargando datos ...",
                "OnFailure": "",
                "OnSuccess": "",
                "Target": {
                    "Service": "/appconsumos_mb/Services/ZAMANAGE_LOGISTIC.service",
                    "Path": `/ZAMMST_RESERVASet?$filter=(Rsnum eq '${reserva}')&$format=json`,
                    "RequestProperties": {
                        "Method": "GET"
                    }
                }
            }
        });

        const resjson = res.data;

        if (resjson?.d?.results?.[0]?.Pdf) {
            const pdfData = resjson.d.results[0].Pdf;

            const result = await context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_FirmarPDF.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando ...",
                    "OnFailure": "",
                    "OnSuccess": "",
                    "Target": {
                        "Service": "/appconsumos_mb/Services/backend_REST.service",
                        "Path": "/firmarPDFRes",
                        "RequestProperties": {
                            "Method": "POST",
                            "Body": {
                                "pdf": `${pdfData}`,
                                "image": `${signatureContent}`,
                                "tipo": tipo
                            }
                        }
                    }
                }
            });

            if (result && result.data) {
                const pdfFirmado = result.data.value;
                context.b64Data = pdfFirmado;

                // Enviar correo

                const enviar = (correo) => {
                    return context.executeAction({
                        "Name": "/appconsumos_mb/Actions/Call_Sendmail.action",
                        "Properties": {
                            "ShowActivityIndicator": true,
                            "ActivityIndicatorText": "Enviando correo ...",
                            "OnFailure": "",
                            "OnSuccess": "",
                            "Target": {
                                "Service": "/appconsumos_mb/Services/backend_REST.service",
                                "Path": "/sendmail",
                                "RequestProperties": {
                                    "Method": "POST",
                                    "Body": {
                                        "to": `${correo}`,
                                        "subject": "PDF Ingenio - Autorización",
                                        "body": "Adjunto PDF firmado desde aplicación Ingenio.",
                                        "nombre": "ingenio_firmado.pdf",
                                        "adj": `${pdfFirmado}`
                                    }
                                }
                            }
                        }
                    });
                };

                // Enviar al primer correo
                enviar(correo_enviar)
                    .then(() => {
                        // Si existe el segundo correo, enviar también
                        if (correo_enviar_aux) {
                            return enviar(correo_enviar_aux);
                        }
                    });



                // Navegar a página anterior
                await context.executeAction({
                    "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                    "Properties": {
                        "NavigateBackToPage": "Detalle_Solicitud_Ingenio"
                    }
                });

                // Esperar más tiempo para asegurar renderizado
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (platform.isAndroid) {
                    await Rule_openDocumentoAnd(context);
                } else if (platform.isIOS) {
                    await Rule_openDocumentoIOS(context);
                }

                // Intentar abrir el PDF
                /* 
                try {

                    if (platform.isAndroid) {
                        await Rule_openDocumentoAnd(context);
                    } else if (platform.isIOS) {
                        await Rule_openDocumentoIOS(context);
                    }
                } catch (errorOpen) {
                    alert("No se pudo abrir el documento:\n" + (errorOpen.message || errorOpen));
                }
                    */
            }
        }

    } catch (error) {
        alert(`Error al procesar el PDF: ${error.message || error}`);
    }
}

