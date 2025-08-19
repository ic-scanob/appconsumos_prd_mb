/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function onChange_Materiales_Revision_Ing(context) {
    const pageProxy = context.getPageProxy();
    var cantSolicitada = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell2")
    var btn_aprobar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
 
    cantSolicitada.setVisible(false)
    btn_aprobar.setVisible(true)
}
