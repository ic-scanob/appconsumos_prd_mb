/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Filtro_Centro_Material_Inv(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info_sociedad = clientData.info_user.sociedad;
    let centroFiltro = '';
    
    if (info_sociedad == "AI01") {
        centroFiltro = "centro ge '2000' and centro le '2199'";
    } else if (info_sociedad == "AI08") {
        centroFiltro = "centro ge '2200'";
    }
    
    let filtro = `$filter=${centroFiltro}&$orderby=almacen`;
    
    return filtro;
}
