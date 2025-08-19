/**
 * Describe this function...
 * @param {IClientAPI} context
 */
import get_FechaHoraCol from '../get_FechaHoraCol.js';
import Rule_openDocumentoAnd from '../Rule_openDocumentoAnd.js';
import Rule_openDocumentoIOS from '../Rule_openDocumentoIOS.js';
export default async function PDFPRUEBA(context) {

    const platform = context.nativescript.platformModule;

    let info_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData().info_user;
    const palabras = info_user.nombre.split(" ");
    const nombre = palabras.slice(0, -1).join(" ");
    let sender_email = context.getGlobalDefinition('/appconsumos_mb/Globals/sender_user_email.global');
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

    const info_solicitud = context.binding;
    const orden = info_solicitud.orden;
    const reserva = info_solicitud.reserva;

    try {
        /*const res = await context.executeAction({
            "Name": "/appconsumos_mb/Actions/Call_ZAMMST_ORDRINSUSet.action",
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
        })

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
            });*/

            /*await context.executeAction({
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
                                "to": "scanob@incauca.com",
                                "subject": "PDF Ingenio - Autorización",
                                "body": "Adjunto PDF firmado desde aplicación Ingenio.",
                                "nombre": "ingenio_firmado.pdf",
                                "adj": `${pdfData}`
                            }
                        }
                    }
                }
            });*/
            let clientDataAutorizar = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();

            const reqdata = {
                    fecha: get_FechaHoraCol(),
                    pEntrega: "",
                    pEntregaficha: "",
                    pAutoriza: info_user.nombre,
                    pAutorizaficha: info_user.ficha
                }
                const datajson = [
                    {
                        alce: "Alce 6", sap: "1215306", desc: "ADAPTADOR RECTO M-M 2083-8-85 1/2x1/2VTP", cant: "2", um: "PZA"
                    },
                    {
                        alce: "Alce 6", sap: "1166831", desc: 'MANGUERA 3/4" X 1.80 MT TCA LOCA 5000 PS', cant: "4", um: "PZA"
                    },
                    {
                        alce: "Alce 6", sap: "1455091", desc: 'ESPIRALETO 3/4', cant: "1", um: "PZA"
                    },
                    {
                        alce: "Alce 6", sap: "1455091", desc: 'ESPIRALETO 3/4', cant: "1", um: "PZA"
                    },
                ]

                let logo_pro = context.getGlobalDefinition('/appconsumos_mb/Globals/logo_pro.global');
        let logo = logo_pro.getValue()

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
            }).then(async (result) => {
                if (result && result.data) {

                    //context.b64Data = result.data.value
                    clientDataAutorizar.b64Data = result.data.value

                
                context.b64Data = result.data.value
                if (platform.isAndroid) {
                    await Rule_openDocumentoAnd(context);
                } else if (platform.isIOS) {
                    await Rule_openDocumentoIOS(context);
                }
            }
        })

    } catch (error) {
        alert(`Error al procesar el PDF: ${error.message || error}`);
    }
}
