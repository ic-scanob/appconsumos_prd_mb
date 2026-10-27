/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_Agregar_Solicitud_CampoEquipo(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Lista_Equipos_Campo').getClientData();
    clientData.lista_materiales = []

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Campo/Equipo/Agregar_Solicitud_Equipos_Campo.page",
            "ModalPage": true,
            "ModalPageFullscreen": true
        }
    });
}
