/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Borrar_Material_Lista_Abaste(context) {
    const pageProxy = context.getPageProxy();
    var data = context.binding
    let clientData = context.evaluateTargetPathForAPI('#Page:Lista_Solicitudes_Reabastecimiento').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")
   
    const index = clientData.lista_materiales.findIndex(item => item.material === data.material);
    if (index !== -1) {
        clientData.lista_materiales.splice(index, 1); // Elimina el elemento en esa posición
    }
 
    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material '${data.material_desc}' eliminado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    });
 
}
