/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Agregar_Materiales_Nuevos_Reabas(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Lista_Solicitudes_Reabastecimiento').getClientData();

    let material = context.evaluateTargetPath('#Page:Agregar_Solicitud_Reabastecimiento/#Control:FormCellListPicker_Materiales_Nuevo/#Value');
    let cant = context.evaluateTargetPath('#Page:Agregar_Solicitud_Reabastecimiento/#Control:FormCellSimpleProperty_Cantidad_Nuevo/#Value');
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
   

    let data = material[0]    
 
    if (!cant || cant < 0) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar una cantidad valida para continuar`
            }
        });
    }
  
    var nuevo = {
        material: data.ReturnValue,
        material_desc: data.DisplayValue.Description,
        cant : cant,
        und: data.DisplayValue.StatusText,
        stock_disponible: null,
        stock_reservado: null,
        tipo: "Nuevo"
    }
   
    const duplicado = clientData.lista_materiales.filter(m => m.material === nuevo.material).length > 0
   
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
