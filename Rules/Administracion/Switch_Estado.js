/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Switch_Estado(context) {
    const pageProxy = context.getPageProxy();
    var sw_component = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1").getControl("estado_edit")
    var estado_temp = context.getValue()

    if(estado_temp){
        sw_component.setHelperText('Activo')
    }else{
        sw_component.setHelperText('Inactivo')
    }

    //alert(sw_component.getType())
    //alert(JSON.stringify(object))
    //alert(JSON.stringify(context.binding))
}
