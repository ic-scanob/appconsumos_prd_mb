/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setEnabled_Tipo_Aceite(context) {
    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:equipo_diferencial/#Value');
    const pageProxy = context.getPageProxy();
    var lp_tipo = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("tipo_diferencial")
    //IsEditable

    if (equipo.length > 0) {
        lp_tipo.setEditable(true)
        
    }else{
        lp_tipo.setEditable(false)
    }

}
