/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Agregar_Material_Revision_Campo(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Campo').getClientData();
    //clientData.lista_mat_solicitud_ing
    let operacion = context.evaluateTargetPath('#Page:Revision_Solicitud_Campo/#Control:operacion_item/#Value')

    let material = context.evaluateTargetPath('#Page:Revision_Solicitud_Campo/#Control:materiales_solicitud/#Value');
    let cant = context.evaluateTargetPath('#Page:Revision_Solicitud_Campo/#Control:cantidad_revision/#Value');
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");

    let data = material[0].BindingObject
    let solicitada = data.cantidad_tomada

    if (!cant || cant < 0) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `Debes ingresar una cantidad válida para continuar`
            }
        });
    }

    if(cant > solicitada){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `La cantidad a aprobar (${cant}) es mayor a la  cantidad solicitada (${solicitada})`
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

    const duplicado = clientData.lista_mat_solicitud_campo.filter(m => m.material.material === data.material.material && m.almacen_almacen === data.almacen_almacen).length > 0

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
    clientData.lista_mat_solicitud_campo.push(data);

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
