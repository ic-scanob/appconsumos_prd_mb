/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setEnabled_Tipo_Aceite_Servotransmisor(context) {
    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Servotransmisor/#Control:equipo_servotrans/#Value');
    const pageProxy = context.getPageProxy();
    var lp_tipo = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("tipo_servotrans")
    //IsEditable

    if (equipo.length > 0) {
        lp_tipo.setEditable(true)
        
    }else{
        lp_tipo.setEditable(false)
    }

}
