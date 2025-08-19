/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Select_almacen(context) {
    let almacen = context.evaluateTargetPath('#Page:Filtro_Campo/#Control:almacen_campo/#Value');
    const pageProxy = context.getPageProxy();
    var btn_orden = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton0")
    var btn_solicitud = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton1")
    var btn_historico = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton2")

    if (almacen.length > 0) {
        btn_orden.setEnabled(true)
        btn_solicitud.setEnabled(true)
        btn_historico.setEnabled(true)
    }else{
        btn_orden.setEnabled(false)
        btn_solicitud.setEnabled(false)
        btn_historico.setEnabled(false)
    }

}
