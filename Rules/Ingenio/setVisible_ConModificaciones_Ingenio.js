/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function setVisible_ConModificaciones_Ingenio(context) {
    const pageProxy = context.getPageProxy();
    var materiales = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    var btn_materiales = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
    var operacion = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell3")
    var botones = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable1")
    var lista = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")
   
    botones.setVisible(false)
    materiales.setVisible(true)
    btn_materiales.setVisible(true)
    lista.setVisible(true)
    operacion.setVisible(false)
}
