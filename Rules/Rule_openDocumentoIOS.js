/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default async function Rule_openDocumentoIOS(context) {

    let page = context.getPageProxy();
    let titulo = page.getName();
    let b64Data = ''
    if (titulo == "Autorizar_Solicitud_Reabastecimiento") {
        let clientDataAutorizar = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
        b64Data = clientDataAutorizar.b64Data
    }

    if (titulo == "Detalle_Solicitudes_Campo" || titulo == "Autorizar_Solicitud_Campo") {
        let clientDataAutorizar = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Campo').getClientData();
        b64Data = clientDataAutorizar.b64Data
    }

    if (titulo == "Autorizar_Solicitud_Ingenio" || titulo == "Detalle_Historico_Campo") {
        b64Data = context.b64Data
    }

    const fs = context.nativescript.fileSystemModule;

    //let actionResult = context.getActionResult("GetArchivo");
    //let b64Data = actionResult.data.Archivo;
    //let formato = actionResult.data.FormatoArc.toLowerCase();
    let formato = "pdf"


    function generateRandomWithSpecialChars() {
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';', '"', '<', '>', '?', '/', '.', ',', '`', '~'];
        const randomIndex1 = Math.floor(Math.random() * specialChars.length);
        const randomIndex2 = Math.floor(Math.random() * specialChars.length);

        const randomNumber = Math.floor(Math.random() * 1001);  // Genera un número entre 0 y 1000

        return specialChars[randomIndex1] + randomNumber + specialChars[randomIndex2];
    }

    function Cover(byteArray) {
        var array = NSData.dataWithBytesLength(byteArray.bytes, byteArray.length);
        return array;
    }

    let mimeType = "";

    switch (formato) {
        case "pdf":
            mimeType = "application/pdf"
            break;
        case "png":
            mimeType = "image/png"
            break;
        case "jpg":
            mimeType = "image/jpeg"
        default:
            mimeType = "text/plain"
    };

    if (b64Data != '') {
        let docConver = null;
        //let imageData = `data:${mimeType};base64,${b64Data}`;

        await context.base64StringToBinary(b64Data).then((result) => {
            docConver = Cover(result);
        }).catch((error) => {
            alert("Error: " + error.message);
            throw error;
        });

        let filename = `${generateRandomWithSpecialChars()}.${formato}`;
        var tempDir = fs.knownFolders.documents();
        var folder = "Files";

        if (!fs.Folder.exists(fs.path.join(tempDir.path, folder))) {
            fs.Folder.fromPath(fs.path.join(tempDir.path, folder));
        }

        var filePath = fs.path.join(tempDir.path, folder, filename);
        var productFile = fs.File.fromPath(filePath);
        //alert("Saving the file at: " + filePath);

        if (docConver != null) {

            try {
                productFile.writeSync(docConver);
            } catch (err) {
                productFile.remove();
                alert("WRITE SYNC FAILED: " + err);
            }

            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/openDocument.action",
                "Properties": {
                    "Path": filePath,
                    "MimeType": mimeType
                }
            });

        } else {
            alert("Hubo un problema al abrir el PDF.");
        }

    }else{
        alert("No fue posible obtener el PDF.")
    }


}
