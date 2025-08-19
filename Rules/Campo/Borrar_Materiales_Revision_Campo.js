/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Borrar_Materiales_Revision_Campo(context) {
    var data = context.binding
    const pageProxy = context.getPageProxy();

    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Campo').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")


    const index = clientData.lista_mat_solicitud_campo.findIndex(item => item.material.material === data.material.material && item.almacen_almacen === data.almacen_almacen);


    if (index !== -1) {
        clientData.lista_mat_solicitud_campo.splice(index, 1); // Elimina el elemento en esa posición

    }

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material '${data.material.material_desc}' del ${data.almacen_almacen} eliminado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    })
}
