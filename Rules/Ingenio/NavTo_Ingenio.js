/**
 * Describe this function...
 * @param {xontext} clientAPI
 */
export default function NavTo_Ingenio(context) {
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
                "PageToOpen": "/appconsumos_mb/Pages/Ingenio/Filtro_Ingenio.page"
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
