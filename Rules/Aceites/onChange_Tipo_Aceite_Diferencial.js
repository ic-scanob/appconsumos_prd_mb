/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function onChange_Tipo_Aceite_Diferencial(context) {
    const pageProxy = context.getPageProxy();
    var form_cell = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    var tipo_consumo = form_cell.getControl("tipo_diferencial")
    let orden_diferencial = form_cell.getControl("orden_diferencial")
    let tipo_consumo_value = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:tipo_diferencial/#Value');
   

    let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:equipo_diferencial/#Value');

    
    if (tipo_consumo_value.length > 0 && tipo_consumo_value[0]?.ReturnValue === "Cambio"){
        //set visible al lp de la orden
        orden_diferencial.setVisible(true);
        //obtener el filtro para la orden
        let equipo_id = equipo[0].BindingObject.equipo
        let target = orden_diferencial.getTargetSpecifier()
        let res = target.setQueryOptions(`$filter=equipo eq '${equipo_id}'`)
    
        orden_diferencial.setTargetSpecifier(res,true)
        //orden_obj.setEditable(true)
        orden_diferencial.redraw()
        return;
    }else{
        orden_diferencial.setVisible(false);
    }


}
