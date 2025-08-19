/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_RevisionSolicitudAbast(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
    clientData.lista_mat_solicitud_abast = []
    clientData.id_de_solicitud = context.binding.id;

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Inventario/Revision_Solicitud_Reabastecimiento.page",
            "ModalPage": true,
            "ModalPageFullscreen": true
        }
    });
}
