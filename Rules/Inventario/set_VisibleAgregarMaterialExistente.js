/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function set_VisibleAgregarMaterialExistente(context) {
    const pageProxy = context.getPageProxy();
    var agregarMaterialExistente = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    var agregarMaterialNuevo = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell2")
    agregarMaterialExistente.setVisible(true)
    agregarMaterialNuevo.setVisible(false)
}
