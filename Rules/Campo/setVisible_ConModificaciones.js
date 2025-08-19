/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function setVisible_ConModificaciones(context) {

    const pageProxy = context.getPageProxy();
    var observaciones = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    var operacion = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell3")
    var materiales = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    var btn_materiales = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
    var botones = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable1")
    var lista = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")
    //var mensajes = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell3")

    //mensajes.setVisible(false)
    botones.setVisible(false)
    operacion.setVisible(false)
    //observaciones.setVisible(true)
    materiales.setVisible(true)
    btn_materiales.setVisible(true)
    lista.setVisible(true)

}
