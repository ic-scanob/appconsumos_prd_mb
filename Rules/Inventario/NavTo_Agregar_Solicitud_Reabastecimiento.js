/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Agregar_Solicitud_Reabastecimiento(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Lista_Solicitudes_Reabastecimiento').getClientData();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Solicitud_Abast').getClientData();
    //let materialesNuevos = clientDataFiltro.materiales_nuevos
    clientData.lista_materiales = []

    /*if(!materialesNuevos){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
            "Properties": {
                "Message": `Cargando materiales, por favor espera un momento...`,
                "Duration": 1
            }
        });
    }*/
 
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Inventario/Agregar_Solicitud_Reabastecimiento.page",
            "ModalPage": true,
            "ModalPageFullscreen": true
        }
    });
 
}
