/**
 * Describe this function...
 * @param {IClientAPI}  context
 */
export default function SyncRevisarCampo(context) {

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/ClosePage.action",
        "Properties": {
            "NavigateBackToPage": "Lista_Solicitudes_Campo"
        }
    }).then(() => {
        return context.executeAction("/appconsumos_mb/Actions/app_consumos_prd/Service/OnlySyncStartedMessage.action")

    });

}
