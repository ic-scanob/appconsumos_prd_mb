/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_List_Campo(context) {
    let centro = context.evaluateTargetPath('#Page:Filtro_Campo/#Control:almacen_campo/#Value')[0].BindingObject.centro
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Campo').getClientData();
    clientData.centro = centro
    clientData.lista_campo = []
    

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Campo/Lista_Ordenes_Campo.page"
        }
    });
}
