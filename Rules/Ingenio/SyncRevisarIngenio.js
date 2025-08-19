/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function SyncRevisarIngenio(context) {
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/ClosePage.action",
        "Properties": {
            "NavigateBackToPage": "Lista_Solicitudes_Ingenio"
        }
    }).then(() => {
        return context.executeAction("/appconsumos_mb/Actions/app_consumos_prd/Service/OnlySyncStartedMessage.action")

    });
}
