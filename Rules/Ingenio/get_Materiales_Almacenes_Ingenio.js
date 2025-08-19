/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Materiales_Almacenes_Ingenio(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Ingenio').getClientData();
    return clientData.lista_inventario
    
    /*let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Ingenio').getClientData();
 
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'AlmacenesApp', [], `$filter=tipo eq 'INGENIO'`).then(async (results) => {
       
        if (results && results.length > 0) {
            let filtro = `$filter=Werks eq '${clientDataFiltro.centro_ingenio}' and Spras eq 'ES' and contains(Txtmd, 'BORRADO') eq false and contains(Txtmd, 'BORRAR') eq false and contains(Txtmd, 'BORRAD_') eq false and (`
 
            results.forEach(e => {
                filtro += `Lgort eq '${e.almacen}' or `      
            });
 
            clientDataFiltro.filtroMaterial = filtro.slice(0, -4)+")&$orderby=Matnr"
            //alert(clientDataFiltro.filtroMaterial)
            //el centro esta indefinido
            return clientDataFiltro.filtroMaterial;
            
 
        }
        return null;
    }).catch((error) => {
       
        alert(`Error al obtener los almacenes ${error.message}`)
    });*/
}
