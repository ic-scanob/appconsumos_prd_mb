/**
 * Describe this function...
 * @param {context} clientAPI
 */
export default function Select_Almacen_Sol_Abast(context) {
    let almacenLP = context.evaluateTargetPath('#Page:Filtro_Almacen_Solicitud_Abast/#Control:FormCellListPicker_Almacen_Reabast/#Value')
    const pageProxy = context.getPageProxy();
    var btn_crearSolicitud = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton_Solicitudes")

    if (almacenLP.length > 0) {
        btn_crearSolicitud.setEnabled(true)
    }else{
        btn_crearSolicitud.setEnabled(false)
    }
}
