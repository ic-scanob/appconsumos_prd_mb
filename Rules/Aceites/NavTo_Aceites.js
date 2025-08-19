/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Aceites(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user

    if(!clientData.info_user){
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
            "Properties": {
                "Message": `Sincronizando datos, por favor espera un momento...`,
                "Duration": 1
            }
        });
    }

    if (info.estado == 'Activo') {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
            "Properties": {
                "PageToOpen": "/appconsumos_mb/Pages/Aceites/Filtro_Aceites.page"
            }
        });
    }

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": "Alerta",
            "Message": `No tienes permisos para ingresar a este módulo`
        }
    });
}
