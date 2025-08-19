/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_Agregar_Solicitud_Campo(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Campo').getClientData();
    clientData.lista_materiales = []

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Campo/Agregar_Solicitud_Campo.page",
            "ModalPage": true,
            "ModalPageFullscreen": true
        }
    });
}
