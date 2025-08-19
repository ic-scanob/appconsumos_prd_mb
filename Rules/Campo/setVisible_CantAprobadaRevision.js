/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function setVisible_CantAprobadaRevision(context) {
    const pageProxy = context.getPageProxy();
    var cantSolicitada = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell2")
    var label = cantSolicitada.getControl("FormCellLabel1")
    var cant_field = cantSolicitada.getControl("cantidad_revision")
    var btn_aprobar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")

    let material = context.evaluateTargetPath('#Page:Revision_Solicitud_Campo/#Control:materiales_solicitud/#Value');

    if (material.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar un material para continuar`
            }
        });
    }
   
    cantSolicitada.setVisible(true);

    setTimeout(() => {
        var cantSol = material[0].BindingObject.cantidad_tomada;
        label.setText(`Cantidad Solicitada: ${cantSol}`);
        cant_field.setValue(cantSol);
        btn_aprobar.setVisible(false);
    }, 200); // 200ms suele ser suficiente

}
