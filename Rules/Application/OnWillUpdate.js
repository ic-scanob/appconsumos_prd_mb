/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function OnWillUpdate(clientAPI) {

    return clientAPI.executeAction('/appconsumos_mb/Actions/Application/OnWillUpdate.action').then((result) => {
        if (result.data) {
            let _app_consumos_prd = clientAPI.executeAction('/appconsumos_mb/Actions/app_consumos_prd/Service/CloseOffline.action');
            let _app_consumos_prd_v2 = clientAPI.executeAction('/appconsumos_mb/Actions/backend_REST/Service/CloseOffline.action');
            let ZBODEGA_AGO_SRV = clientAPI.executeAction('/appconsumos_mb/Actions/ZBODEGA_AGO_SRV/Service/CloseOffline.action');
            return Promise.all([_app_consumos_prd, ZBODEGA_AGO_SRV, _app_consumos_prd_v2]).then(() => {
                Promise.resolve();
            }).catch((err) => {
                Promise.reject('Error al cerrar Odatas sin conexión ' + err.message);
            });
        } else {
            return Promise.reject('User Deferred');
        }
    });


}





