/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Agregar_Materiales_Solicitud_Reabas(context) {

    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Lista_Solicitudes_Reabastecimiento').getClientData();

    let material = context.evaluateTargetPath('#Page:Agregar_Solicitud_Reabastecimiento/#Control:FormCellListPicker_Materiales/#Value');
    let cant = context.evaluateTargetPath('#Page:Agregar_Solicitud_Reabastecimiento/#Control:FormCellSimpleProperty_Cantidad/#Value');
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
    let stock = data.stock_disponible
 
    //TODO DESCOMENTAR CUANDO HAYA INVENTARIO
    /*if(stock == 0){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `No hay stock disponible para este material`
            }
        });
    }*/
 
    if (!cant || cant < 0) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar una cantidad valida para continuar`
            }
        });
    }
 
    //TODO DESCOMENTAR CUANDO HAYA INVENTARIO
    /*if(cant > stock){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar una cantidad menor para continuar. La cantidad disponible es de ${stock} und`
            }
        });
    }*/
 
   
 
    var nuevo = {
        material: data.material,
        material_desc: data.material_desc,
        cant : cant,
        und: data.und.und_vz,
        stock_disponible: data.stock_disponible,
        stock_reservado: data.stock_reservado,
        tipo: "Registrado"
    }
 
   
    const duplicado = clientData.lista_materiales.filter(m => m.material === data.material).length > 0
   
    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `El material ya fue ingresado anteriormente`
            }
        });
    }
 
    clientData.lista_materiales.push(nuevo)
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
