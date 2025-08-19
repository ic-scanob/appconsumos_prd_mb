/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Rechazar_Material_Revision_Ingenio(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Ingenio').getClientData();
    //clientData.lista_mat_solicitud_ing

    let material = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:FormCellListPicker_Materiales/#Value');

    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");

    let data = material[0].BindingObject

    if (material.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `Debes seleccionar un material para continuar`
            }
        });
    }

    const duplicado = clientData.lista_mat_solicitud_ing.filter(m => m.mat_nuevo === data.mat_nuevo && m.almacen_almacen === data.almacen_almacen).length > 0

    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `El material ya fue agregado anteriormente`
            }
        });
    }

    data.cant = 0
    data.aprobado = 'Rechazado'
    clientData.lista_mat_solicitud_ing.push(data);

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
