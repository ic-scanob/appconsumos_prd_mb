/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_RevisarPlanillaAceiteMotor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Motor').getClientData();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientDataFiltro.data_planilla_motor.id;
    let filtro = `$expand=equipo&$filter=planilla_id eq ${id_planilla}&$orderby=pos`
    clientData.lista_revision_motor = []
    clientData.cantCambio = 0
    clientData.total = 0

    clientData.materiales_lista =[]

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro).then(async (results) => {
        clientData.total = results.length
        if (results && results.length > 0) {
            var cambio = []
            
            results.forEach(e => {
                if(e.tipo == 'Cambio'){
                    e.clase_mov = "261";  // <- asignar clase de movimiento a los tipo cambio
                    cambio.push(e)
                }else if(e.tipo == 'Full'){
                    clientData.cantCambio += 1
                }
                
            });
            //clientData.lista_revision_motor = cambio
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                "Properties": {
                    "PageToOpen": "/appconsumos_mb/Pages/Aceites/Revisar_Planilla_Aceite_Motor.page",
                    "ModalPage": true,
                    "ModalPageFullscreen": true
                }
            });
    
        } else {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Sin datos",
                    "Message": "No se encontraron items para la planilla seleccionada.",
                    "OKCaption": "Aceptar"
                }
            });
        }
    })
    
}
