/**
 * Valida el motivo de rechazo, guarda los datos y confirma el rechazo.
 * @param {IClientAPI} context
 */
export default function ValidarRechazar_Campo(context) {
    const observaciones = context.evaluateTargetPath('#Page:Rechazar_Solicitud_Campo/#Control:observaciones/#Value');

    // 1. Validación
    if (!observaciones || observaciones.trim() === '') {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Motivo de Rechazo Requerido",
                "Message": "Falta escribir el motivo de rechazo, vuelve a intentarlo."
            }
        });
    }

    // 2. Guardar datos en ClientData (mantén las mismas páginas que usa tu action de Update)
    const clientDataDetalle = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Campo').getClientData();
    clientDataDetalle.id_de_solicitud = context.binding.id;

    const clientDataRechazo = context.evaluateTargetPathForAPI('#Page:Rechazar_Solicitud_Campo').getClientData();
    clientDataRechazo.observaciones = observaciones.trim();

    // 3. Una sola confirmación que ejecuta el Update
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": "Rechazar Solicitud",
            "Message": "¿Estás seguro que deseas rechazar el consumo? Al rechazarlo, deberás generar nuevamente la solicitud completa.",
            "OKCaption": "Aceptar",
            "CancelCaption": "Cancelar",
            "OnOK": "/appconsumos_mb/Actions/oData/Equipo/Update_SolicitudesApp_Rechazar_CampoEquipo.action"
        }
    });
}