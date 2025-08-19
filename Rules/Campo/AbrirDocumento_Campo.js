import Rule_openDocumentoAnd from '../Rule_openDocumentoAnd.js';
import Rule_openDocumentoIOS from '../Rule_openDocumentoIOS.js';

/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function AbrirDocumento_Campo(context) {
    let info_solicitud = context.binding;
    let orden = info_solicitud.orden_orden;
    let id_solicitud = info_solicitud.id;

    const platform = context.nativescript.platformModule;
    
    let filtro = `$filter=solicitud_id eq ${id_solicitud} and orden eq '${orden}'&$orderby=fecha desc`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Pdf', [], filtro).then(async (results) => {
        if(results && results.length > 0){
            var info_pdf = results.getItem(0)
            context.b64Data = info_pdf.PDFData
            if (platform.isAndroid) {
                return Rule_openDocumentoAnd(context)
            } else if (platform.isIOS) {
                return Rule_openDocumentoIOS(context)
            }   
        }
    })
}
