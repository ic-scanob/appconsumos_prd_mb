/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Agregar_Material_Revision_Ingenio(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Ingenio').getClientData();
    //clientData.lista_mat_solicitud_ing
    let operacion = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:operacion_item/#Value')

    let material = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:FormCellListPicker_Materiales/#Value');
    let cant = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:FormCellSimpleProperty_Cantidad/#Value');
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");

    let data = material[0].BindingObject
    let cantSolicitada = data.cantidad_tomada
    let stock = data.stock_disponible

    if (!cant || cant < 0) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `Debes ingresar una cantidad válida para continuar`
            }
        });
    }

    if (operacion.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Operación no seleccionada",
                "Message": "Debes seleccionar una operación. Este campo es obligatorio.",
                "OKCaption": "Aceptar"
            }
        })
    }
    
    if (cant > cantSolicitada) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `La cantidad a aprobar (${cant}) es mayor a la cantidad solicitada (${cantSolicitada}).`
            }
        });
    }

   const duplicado = clientData.lista_mat_solicitud_ing.filter(m => m.mat_nuevo === data.mat_nuevo && m.almacen_almacen === data.almacen_almacen).length > 0

    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `El material ya fue ingresado anteriormente`
            }
        });
    }

    data.cant = cant
    data.aprobado = 'Aprobado'
    data.operacion = operacion[0].ReturnValue
    clientData.lista_mat_solicitud_ing.push(data);

    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material Aprobado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    });
    
    

    
}
