/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function setVisible_CantAprobadaRevision_Abast(context) {

    const pageProxy = context.getPageProxy();
    var cantSolicitada = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    var cant_field = cantSolicitada.getControl("FormCellSimpleProperty_Cantidad")
    var btn_aprobar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
    let clientData = context.evaluateTargetPathForAPI('#Page:Revision_Solicitud_Reabastecimiento').getClientData();
    let almacen = context.evaluateTargetPath('#Page:Revision_Sol_Almacenes_Abast/#Control:almacen/#Value')
    
 
    if (almacen.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Almacén no seleccionado",
                "Message": `Debes seleccionar un almacen para continuar`
            }
        });
    }

    //alert(JSON.stringify(almacen[0]))
    var index = almacen[0].SelectedIndex
    var data = clientData.listaInventario[index].BindingObject
    //alert(JSON.stringify(data))

    if (data.Labst < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Almacén sin stock",
                "Message": `El almacén seleccionado no tiene stock disponible para este material.`
            }
        });
    }

   
    cantSolicitada.setVisible(true);
 
    setTimeout(() => {
        var cantSol = clientData.infoMaterial.cantidad_tomada
        cant_field.setValue(cantSol);
        btn_aprobar.setVisible(false);
    }, 200);
}
