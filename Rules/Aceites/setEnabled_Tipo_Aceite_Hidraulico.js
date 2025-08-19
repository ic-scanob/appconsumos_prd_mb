/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function setEnabled_Tipo_Aceite_Hidraulico(context) {
    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Hidraulico/#Control:equipo_hidraulico/#Value');
    const pageProxy = context.getPageProxy();
    var lp_tipo = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("tipo_hidraulico")
    //IsEditable

    if (equipo.length > 0) {
        lp_tipo.setEditable(true)
        
    }else{
        lp_tipo.setEditable(false)
    }
}
