/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Planillas_Consumo_Aceites(context) {
    let centro = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value')[0].BindingObject.centro
    let almacen = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value')[0].BindingObject.almacen
    let sociedad = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value')[0].BindingObject.sociedad
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    clientData.centro_aceite_planilla = centro
    clientData.almacen_aceite_planilla = almacen
    clientData.sociedad_aceite_planilla = sociedad
    clientData.aceite_num_planilla = ""

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Aceites/Filtro_Fecha_Aceite.page"
        }
    });
}
