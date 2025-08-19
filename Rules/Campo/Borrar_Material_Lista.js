/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Borrar_Material_Lista(context) {
    var data = context.binding
    const pageProxy = context.getPageProxy();

    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Campo').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")


    const index = clientData.lista_materiales.findIndex(item => item.material === data.material && item.almacen.almacen === data.almacen.almacen);


    if (index !== -1) {
        clientData.lista_materiales.splice(index, 1); // Elimina el elemento en esa posición

    }

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material '${data.material_desc}' del ${data.almacen.almacen_desc} eliminado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    })

}
