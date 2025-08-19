/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Rechazar_Material_Revision_Campo(context) {

    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Campo').getClientData();
    //clientData.lista_mat_solicitud_ing

    let material = context.evaluateTargetPath('#Page:Revision_Solicitud_Campo/#Control:materiales_solicitud/#Value');

    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");

    let data = material[0].BindingObject

    if (material.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar un material para continuar`
            }
        });
    }

    const duplicado = clientData.lista_mat_solicitud_campo.filter(m => m.material.material === data.material.material && m.almacen_almacen === data.almacen_almacen).length > 0

    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `El material ya fue agregado anteriormente`
            }
        });
    }

    data.cant = 0
    data.aprobado = 'Rechazado'
    clientData.lista_mat_solicitud_campo.push(data);

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material Rechazado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    });

}
