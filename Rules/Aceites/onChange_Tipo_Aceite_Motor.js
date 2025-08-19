/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function onChange_Tipo_Aceite_Motor(context) {
    const pageProxy = context.getPageProxy();
    var form_cell = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    //var tipo_consumo = form_cell.getControl("tipo_motor")
    let orden_motor = form_cell.getControl("orden_motor")
    let tipo_consumo_value = context.evaluateTargetPath('#Page:Registrar_Aceite_Motor/#Control:tipo_motor/#Value');
   
    
    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Motor/#Control:equipo_motor/#Value');
   
    if ( tipo_consumo_value.length > 0 && tipo_consumo_value[0]?.ReturnValue === "Cambio"){
        //set visible al lp de la orden
        //let tipo = tipo_consumo_value[0].ReturnValue
        orden_motor.setVisible(true);
        //obtener el filtro para la orden
        let equipo_id = equipo[0].BindingObject.equipo
        let target = orden_motor.getTargetSpecifier()
        let res = target.setQueryOptions(`$filter=equipo eq '${equipo_id}'`)
    
        orden_motor.setTargetSpecifier(res,true)
        //orden_obj.setEditable(true)
        orden_motor.redraw()
        return;
    }else{
        orden_motor.setVisible(false);
    }

}
