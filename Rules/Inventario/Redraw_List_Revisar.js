/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Redraw_List_Revisar(context) {

    const pageProxy = context.getPageProxy();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");
    list_component.redraw()
}
