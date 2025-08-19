/**
 * Describe this function...
 * @param {context} clientAPI
 */
export default function Select_Almacen_Ingenio(context) {
    let almacen_ingenio = context.evaluateTargetPath('#Page:Filtro_Ingenio/#Control:FormCellListPicker_Almacen_O/#Value');
    const pageProxy = context.getPageProxy();
    var btn_orden = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton_Buscar")
    var btn_solicitud = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton1")
    var btn_historico = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton2")
    
    if (almacen_ingenio.length > 0) {
        btn_orden.setEnabled(true)
        btn_solicitud.setEnabled(true)
        btn_historico.setEnabled(true)
    }else{
        btn_orden.setEnabled(false)
        btn_solicitud.setEnabled(false)
        btn_historico.setEnabled(false)
    }
}
