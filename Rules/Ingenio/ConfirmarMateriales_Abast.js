/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function ConfirmarMateriales_Abast(context) {
    const pageProxy = context.getPageProxy();
    var table = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")
    var items = table.getSelectedItems()
    var cant = table.getSelectedItemsCount()

    //alert(JSON.stringify(items[0]))
    if(cant == 0){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "No hay materiales seleccionados",
                "Message": "Selecciona al menos un material para poder confirmar.",
                "OKCaption": "Aceptar"
            }
        });
    }

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Message": "¿Estas seguro que deseas confirmar la recepción de los materiales seleccionados?",
            "Title": "Confirmar recepción",
            "OKCaption": "Aceptar",
            "OnOK": "/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Recepcion_Abast.action",
            "CancelCaption": "Cancelar"
        }
    });


    /*hacer el update de la tabla de items a confimrar la recepcion y el estado de la solicitud cambiarlo a tramitado*/

    //items[0].binding
    //alert(JSON.stringify(items))
}
