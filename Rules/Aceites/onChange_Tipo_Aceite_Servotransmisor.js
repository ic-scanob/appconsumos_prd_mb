/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function onChange_Tipo_Aceite_Servotransmisor(context) {
    const pageProxy = context.getPageProxy();
    var form_cell = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    var tipo_consumo = form_cell.getControl("tipo_servotrans")
    let orden_servotrans = form_cell.getControl("orden_servotrans")
    let tipo_consumo_value = context.evaluateTargetPath('#Page:Registrar_Aceite_Servotransmisor/#Control:tipo_servotrans/#Value');
   

    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Servotransmisor/#Control:equipo_servotrans/#Value');

    
    if (tipo_consumo_value.length > 0 && tipo_consumo_value[0]?.ReturnValue === "Cambio"){
        //set visible al lp de la orden
        orden_servotrans.setVisible(true);
        //obtener el filtro para la orden
        let equipo_id = equipo[0].BindingObject.equipo
        let target = orden_servotrans.getTargetSpecifier()
        let res = target.setQueryOptions(`$filter=equipo eq '${equipo_id}'`)
    
        orden_servotrans.setTargetSpecifier(res,true)
        //orden_obj.setEditable(true)
        orden_servotrans.redraw()
        return;
    }else{
        orden_servotrans.setVisible(false);
    }

}
