import Rule_openDocumentoAnd from '../Rule_openDocumentoAnd.js';
import Rule_openDocumentoIOS from '../Rule_openDocumentoIOS.js';
/**
 * Describe this function...
 * @param {IClientAPI} context
 */

export default async function FirmarSolicitud_Campo(context) {

    //manejar bien los errores del backend y la autenticación
    //no se envia correo electronico
    //1. Enviar los componentes a la orden - hay que validar si ya hay creados materiales con las cantidades solicitadas usar esos campos y no hay que crearlos 
    //   - se debe guardar en los componentes de la solicitud las posiciones en la reserva de los materiales creados o escogidos
    //2. liquidar los componentes de la orden - se debe guardar el numero de documento de material en cada componente y se debe mostrar en el detalle de los items de la solicitud
    //3. actualizar los componentes como entregados en la bd y el estado de la solicitud 
    //4. se debe obtener el pdf de la orden y mostrarlo con la firma del autorizador ingresada y guardar el pdf a la base de datos para luego poder consultarlo desde el historico



    function sendEmail(pdf) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/Call_Sendmail.action",
            "Properties": {
                "OnFailure": "",
                "OnSuccess": "",
                "Target": {
                    "Service": "/appconsumos_mb/Services/backend_REST.service",
                    "Path": "/sendmail",
                    "RequestProperties": {
                        "Method": "POST",
                        "Body": {
                            "sender": "natalia.lopez@structum-co.com",
                            "to": "nlopez8066@outlook.com",
                            "subject": "Prueba",
                            "body": `Cuerpo prueba`,
                            "nombre": "pdfprueba.pdf",
                            "adj":`${pdf}`
                        },

                    }
                }
            }
        }).then((result) => {
            if (result && result.data) {
                alert(JSON.stringify(result))
            }

        }).catch((error) => {
            alert(error)
        });
    }

    const base64Pdf = `JVBERi0xLjMKJf////8KNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgOCAwIFIKPj4KL0NvbG9yU3BhY2UgPDwKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAyOTUKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCniclZO7TsQwEEV7f8X8wC7zvJNIUQokKOgQ6RAFWpJuC/j/AiXQQBytLEuWZVlzfI/HQkxMJyGm7JUu1/JZZLd3P/1uCil3Z0XP7JScZ07QdC13j0LS0bSU1yEUkYwldaSTMw3pCGUYFszK6RDoSMo04AJRzl4ZFyxILCPxG01P5WEqzyWYhJkkeD39NZeXW7eLIKRXb8WpWOAZsPR/IOVmkvIhyg2COR091qz+B2XtoexGqoChr6jTZnVRz/Ox5XlfZ0jaXl0baVNXR5kY73W1lbfjJOoWOhuvY6fLm3XZwZuMFGtzx/oDZF1VpbXxNml1oHV7ZW3F7TiNurnO1lWVoVmZ1DtMf3oLc+1jtlE2UXWMicVeVVt5O06hbqmzxU7VN8QUFdoKZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iagooUERGS2l0KQplbmRvYmoKMTEgMCBvYmoKKFBERktpdCkKZW5kb2JqCjEyIDAgb2JqCihEOjIwMjUwNjI3MTUyMDQwWikKZW5kb2JqCjkgMCBvYmoKPDwKL1Byb2R1Y2VyIDEwIDAgUgovQ3JlYXRvciAxMSAwIFIKL0NyZWF0aW9uRGF0ZSAxMiAwIFIKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago0IDAgb2JqCjw8Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovTmFtZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs3IDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Rlc3RzIDw8CiAgL05hbWVzIFsKXQo+Pgo+PgplbmRvYmoKeHJlZgowIDEzCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDkzNCAwMDAwMCBuIAowMDAwMDAwOTkxIDAwMDAwIG4gCjAwMDAwMDA4NzIgMDAwMDAgbiAKMDAwMDAwMDg1MSAwMDAwMCBuIAowMDAwMDAwMjI2IDAwMDAwIG4gCjAwMDAwMDAxMTkgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwNzU0IDAwMDAwIG4gCjAwMDAwMDA2NzkgMDAwMDAgbiAKMDAwMDAwMDU5MyAwMDAwMCBuIAowMDAwMDAwNjE4IDAwMDAwIG4gCjAwMDAwMDA2NDMgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxMwovUm9vdCAzIDAgUgovSW5mbyA5IDAgUgovSUQgWzwwODRjMzgzN2I5NjMxNmVhYmQ5N2E0NDk1YmIwZmVkND4gPDA4NGMzODM3Yjk2MzE2ZWFiZDk3YTQ0OTViYjBmZWQ0Pl0KPj4Kc3RhcnR4cmVmCjEwMzgKJSVFT0YK`
    
    //const pageProxy = context.getPageProxy();
    const platform = context.nativescript.platformModule;
    const signatureObject = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Campo/#Control:FormCellInlineSignatureCapture0/#Value");
    let signatureContent;

    if (platform.isAndroid) {
        signatureContent = android.util.Base64.encodeToString(signatureObject.content, android.util.Base64.DEFAULT);
    } else if (platform.isIOS) {
        signatureContent = signatureObject.content.base64Encoding();
    }

    alert("entro firmar")


    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/Call_FirmarPDF.action",
        "Properties": {
            "OnFailure": "",
            "OnSuccess": "",
            "Target": {
                "Service": "/appconsumos_mb/Services/backend_REST.service",
                "Path": "/firmarPDF",
                "RequestProperties": {
                    "Method": "POST",
                    "Body": {
                        "pdf": `${base64Pdf}`,
                        "image": `${signatureContent}`
                    },

                }
            }
        }
    }).then((result) => {
        if (result && result.data) {

            //alert(result.data.value)//el pdf en base64
            context.b64Data = result.data.value
            sendEmail(result.data.value)
            if (platform.isAndroid) {
                return Rule_openDocumentoAnd(context)
            } else if (platform.isIOS) {
                return Rule_openDocumentoIOS(context)
            }


            /*context.executeAction({
                "Name": "/appconsumos_mb/Actions/openDocument.action",
                "Properties":{
                    "Path": result.data.value,
                    "MimeType": "application/pdf",
                    "OnSuccess":""
                }
            });*/
            //let mensaje = result.data.Message;

        }



    }).catch((error) => {
        alert(error)
    });

    /*let servicePath = "/appconsumos_mb/Services/app_consumos_prd.service";
    let functionDef = {
        "Name": "firmarPDF",
        "Parameters": {
            "pdf": `${base64Pdf}`,
            "image":`${signatureContent}`
        }
    };
    let headers = null;
    return context.callFunction(servicePath, functionDef, headers).then((result) => {
        // Si el servicio devuelve un string plano
        alert(result)
        alert(JSON.stringify(result))
        if (result && typeof result === "string") {
            alert(`Resultado: ${result}`);
        } else if (result && result.value) {
            alert(`Resultado: ${result.value}`);
        } else {
            alert("La acción no devolvió resultado esperado.");
        }
    }).catch((error) => {
        alert(`Error al ejecutar firmaPDF: ${error}`);
    });*/


    /*alert("entro")
    let result;
    try {
        result = await context.invokeFunction("firmarPDF", { pdf: `${base64Pdf}`, image: `${signatureContent}` });
        if (result.data) {
            // Handle the result (e.g., display it in a message)
            alert("res exitosa")
        }
    } catch (error) {
        alert("Error al firmar el PDF:");
        alert(error)
    }*/


    /*let servicePath = "/appconsumos_mb/Services/app_consumos_prd.service";
    let functionDef = {
        "Name": "firmarPDF",
        "Parameters": {
            "pdf": `${base64Pdf}`,
            "image":`${signatureContent}`
        }
    };
    let headers = null;
    return context.callFunction(servicePath, functionDef, headers).then((result) => {
        //Because this Function Import return an Edm.Int64 type data, the result in result will simply be an integer value.
        alert("res exitosa")
        return context.executeAction({
            "Name": "/appconsumos_mb/Rules/Campo/Response_firmarPDF.js",
        });
    }).catch((error) => {
        alert(error)
    });*/


    /*return context.executeAction({
        "Name": "/appconsumos_mb/Actions/oData/Call_firmarPDF.action",
        "Properties": {
            "OnFailure": {
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Message": "Error - {#ActionResults:Call_firmarPDF/error}"
                }
            },
            "OnSuccess": "/appconsumos_mb/Rules/Campo/Response_firmarPDF.js",
            "Target": {
                "Service": "/appconsumos_mb/Services/backend_REST.service",
                "Path": `/firmarPDF(pdf='${base64Pdf}',image='${signatureContent}')`,
                "RequestProperties": {
                    "Method": "GET",
                    "FetchCSRF": true
                }
            }
        }
    })*/
}
