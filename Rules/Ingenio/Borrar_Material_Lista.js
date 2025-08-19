/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Borrar_Material_Lista(context) {

    var data = context.binding
    const pageProxy = context.getPageProxy();

    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Ingenio').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")


    const index = clientData.lista_materiales.findIndex(item => item.Matnr === data.Matnr && item.Lgort === data.Lgort);


    if (index !== -1) {
        clientData.lista_materiales.splice(index, 1); // Elimina el elemento en esa posición

    }

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material '${data.Txtmd}' del ${data.Lgort} eliminado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    })

}
