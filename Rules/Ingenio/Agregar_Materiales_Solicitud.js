/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Agregar_Materiales_Solicitud(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Ingenio').getClientData();

    let material = context.evaluateTargetPath('#Page:Agregar_Solicitud_Ingenio/#Control:material/#Value');
    let cant = context.evaluateTargetPath('#Page:Agregar_Solicitud_Ingenio/#Control:cantidad/#Value');
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

    var index = material[0].SelectedIndex
    let data = clientData.lista_inventario[index].BindingObject
    let stock = data.Labst

    
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


    if(cant > stock){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar una cantidad menor para continuar. La cantidad disponible es de ${stock} und`
            }
        });
    }



    /*var nuevo = {
        id: data.almacen.almacen_desc+"-"+data.material,
        material: data.material,
        material_desc: data.material_desc,
        almacen: data.almacen.almacen , 
        almacen_desc: data.almacen.almacen_desc,
        centro: data.centro,
        cant : cant,
        stock_disponible: data.stock_disponible,
        stock_reservado: data.stock_reservado
    }*/

    const duplicado = clientData.lista_materiales.filter(m => m.Matnr === data.Matnr && m.Lgort === data.Lgort).length > 0

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
