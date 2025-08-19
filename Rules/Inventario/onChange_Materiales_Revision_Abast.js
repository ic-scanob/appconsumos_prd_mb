/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function onChange_Materiales_Revision_Abast(context) {

    const pageProxy = context.getPageProxy();
    var cantSolicitada = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    var btn_aprobar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
 
    cantSolicitada.setVisible(false)
    btn_aprobar.setVisible(true)
}
