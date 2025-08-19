/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Filtro_Abast(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Inicio_Inventario').getClientData();
    clientData.lista_abast = []

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Inventario/Filtro_Almacen_Solicitud_Abast.page"
        }
    });

}
