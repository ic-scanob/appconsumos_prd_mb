/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Borrar_Materiales_Revision_Abast(context) {
    var data = context.binding
    const pageProxy = context.getPageProxy();

    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")


    const index = clientData.lista_mat_solicitud_abast.findIndex(item => item.material === data.material);


    if (index !== -1) {
        clientData.lista_mat_solicitud_abast.splice(index, 1); // Elimina el elemento en esa posición

    }

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material '${data.material_desc}' eliminado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    })
}
