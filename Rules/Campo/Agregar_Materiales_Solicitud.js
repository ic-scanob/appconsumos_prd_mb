/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Agregar_Materiales_Solicitud(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Campo').getClientData();

    let material = context.evaluateTargetPath('#Page:Agregar_Solicitud_Campo/#Control:material/#Value');
    let cant = context.evaluateTargetPath('#Page:Agregar_Solicitud_Campo/#Control:cantidad/#Value');
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")

    if (material.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar un material para continuar`
            }
        });
    }
    
    let data = material[0].BindingObject
    let stock = data.stock_disponible + data.stock_reservado

    //TODO DESCOMENTAR CUANDO HAYA INVENTARIO
    if(stock == 0){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `No hay stock disponible para este material`
            }
        });
    }

    if (!cant || cant < 0) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar una cantidad válida para continuar`
            }
        });
    }

    //TODO DESCOMENTAR CUANDO HAYA INVENTARIO
    if(cant > stock){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar una cantidad menor para continuar. La cantidad disponible es de ${stock} und`
            }
        });
    }
    
    const duplicado = clientData.lista_materiales.filter(m => m.material === data.material && m.almacen.almacen === data.almacen.almacen).length > 0
    
    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `El material ya fue ingresado anteriormente`
            }
        });
    }

    data.cant = cant
    clientData.lista_materiales.push(data)
    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Nuevo material agregado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    });
}
