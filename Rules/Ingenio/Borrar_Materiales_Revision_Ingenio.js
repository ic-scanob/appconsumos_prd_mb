/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Borrar_Materiales_Revision_Ingenio(context) {
    var data = context.binding
    const pageProxy = context.getPageProxy();

    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Ingenio').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")


    const index = clientData.lista_mat_solicitud_ing.findIndex(item => item.mat_nuevo === data.mat_nuevo && item.almacen_almacen === data.almacen_almacen);


    if (index !== -1) {
        clientData.lista_mat_solicitud_ing.splice(index, 1); // Elimina el elemento en esa posición

    }

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material '${data.mat_nuevo_desc}' del ${data.almacen_almacen} eliminado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    })
}
