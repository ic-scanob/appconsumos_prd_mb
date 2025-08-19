/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Crear_Planilla(context) {
    let centro = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value')[0].BindingObject.centro
    let almacen = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value')[0].BindingObject.almacen
    let sociedad = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value')[0].BindingObject.sociedad
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    clientData.centro_aceite_planilla = centro
    clientData.almacen_aceite_planilla = almacen
    clientData.sociedad_aceite_planilla = sociedad
    clientData.aceite_num_planilla = ""
    clientData.lista_aceites = []

    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData_user.info_user;

    if (info.sociedad === 'AI01') {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
            "Properties": {
                "PageToOpen": "/appconsumos_mb/Pages/Aceites/Crear_Planilla_Consumo_Incauca.page"
            }
        });
    }

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Aceites/Crear_Planilla_Consumo.page"
        }
    });


    
}
