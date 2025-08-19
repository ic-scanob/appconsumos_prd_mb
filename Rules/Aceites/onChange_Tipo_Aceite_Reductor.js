/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function onChange_Tipo_Aceite_Reductor(context) {
    const pageProxy = context.getPageProxy();
    var form_cell = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    var tipo_consumo = form_cell.getControl("tipo_reductor")
    let orden_reductor = form_cell.getControl("orden_reductor")
    let tipo_consumo_value = context.evaluateTargetPath('#Page:Registrar_Aceite_Reductores/#Control:tipo_reductor/#Value');
   

    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Reductores/#Control:equipo_reductor/#Value');


    if (tipo_consumo_value.length > 0 && tipo_consumo_value[0]?.ReturnValue === "Cambio"){
        //set visible al lp de la orden
        orden_reductor.setVisible(true);
        //obtener el filtro para la orden
        let equipo_id = equipo[0].BindingObject.equipo
        let target = orden_reductor.getTargetSpecifier()
        let res = target.setQueryOptions(`$filter=equipo eq '${equipo_id}'`)
    
        orden_reductor.setTargetSpecifier(res,true)
        //orden_obj.setEditable(true)
        orden_reductor.redraw()
        return;
    }else{
        orden_reductor.setVisible(false);
    }

}
