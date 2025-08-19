/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Select_Almacen_Filtro_Inventario(context) {
    let almacenLPInv = context.evaluateTargetPath('#Page:Filtro_Almacen_Inventario/#Control:FormCellListPicker_Almacen_Inv/#Value')
    const pageProxy = context.getPageProxy();
    var btn_inventario = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("btn_inventario")

    if (almacenLPInv.length > 0) {
        btn_inventario.setEnabled(true)
    }else{
        btn_inventario.setEnabled(false)
    }
}
