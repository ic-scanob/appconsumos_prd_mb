/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_Estado(context) {
    const pageProxy = context.getPageProxy();
    var sw_component = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1").getControl("estado_edit")
    var estado_temp = sw_component.getValue()

    if(estado_temp){
        return 'Activo'
    }else{
        return 'Inactivo'
    }
}
