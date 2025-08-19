/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Select_Material_Revisar_Abast(context) {
    let materialLP = context.evaluateTargetPath('#Page:Revision_Solicitud_Reabastecimiento/#Control:materiales_revision_abast/#Value')
    const pageProxy = context.getPageProxy();
    var btn_almacenes = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("btn_almacenes")

    if (materialLP.length > 0) {
        btn_almacenes.setEnabled(true)
    }else{
        btn_almacenes.setEnabled(false)
    }
}
