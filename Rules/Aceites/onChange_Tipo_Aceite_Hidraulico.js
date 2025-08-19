/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function onChange_Tipo_Aceite_Hidraulico(context) {
    const pageProxy = context.getPageProxy();
    var form_cell = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    //var tipo_consumo = form_cell.getControl("tipo_hidraulico")
    let orden_hidraulico = form_cell.getControl("orden_hidraulico")
    let tipo_consumo_value = context.evaluateTargetPath('#Page:Registrar_Aceite_Hidraulico/#Control:tipo_hidraulico/#Value');
   
    
    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Hidraulico/#Control:equipo_hidraulico/#Value');
   
    if ( tipo_consumo_value.length > 0 && tipo_consumo_value[0]?.ReturnValue === "Cambio"){
        //set visible al lp de la orden
        //let tipo = tipo_consumo_value[0].ReturnValue
        orden_hidraulico.setVisible(true);
        //obtener el filtro para la orden
        let equipo_id = equipo[0].BindingObject.equipo
        let target = orden_hidraulico.getTargetSpecifier()
        let res = target.setQueryOptions(`$filter=equipo eq '${equipo_id}'`)
    
        orden_hidraulico.setTargetSpecifier(res,true)
        //orden_obj.setEditable(true)
        orden_hidraulico.redraw()
        return;
    }else{
        orden_hidraulico.setVisible(false);
    }
}
