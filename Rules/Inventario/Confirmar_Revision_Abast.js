/**
 * Confirma la revisión de una solicitud de reabastecimiento.
 * @param {IClientAPI} context
 */
export default function Confirmar_Revision_Abast(context) {

    let id_solicitud = context.binding.id;
    let filtro = `$filter=solicitud_id eq ${id_solicitud}`;
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
    let listaDeAgregados = clientData.lista_mat_solicitud_abast || [];

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then((results) => {
        if (results && results.length > 0) {
            let totalComponentes = results.length;

            if (listaDeAgregados.length < totalComponentes) {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Solicitud No Confirmada",
                        "Message": "No puedes confirmar la solicitud hasta que se hayan agregado todos los materiales."
                    }
                });
            }

            // Validaciones sobre el campo 'aprobado'
            let todosRechazados = listaDeAgregados.every(m => m.aprobado === 'Rechazado');
            let alMenosUnoAprobado = listaDeAgregados.some(m => m.aprobado === 'Aprobado');

            if (todosRechazados) {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Solicitud No Aprobada",
                        "Message": "No se puede aprobar la solicitud porque todos los materiales fueron rechazados."
                    }
                });
            }

            if (alMenosUnoAprobado) {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Confirmación",
                        "Message": "¿Estás seguro que deseas aprobar la solicitud?",
                        "OKCaption": "Aceptar",
                        "OnOK": "/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Confirmar_Abast.action",
                        "CancelCaption": "Cancelar"
                    }
                });
            }

            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Estado no definido",
                    "Message": "Al menos un material debe estar aprobado para confirmar la solicitud."
                }
            });

        } else {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Error",
                    "Message": "Error al tratar de traer los componentes de la solicitud."
                }
            });
        }

    }).catch((error) => {
        alert(`Error ${error.message}`);
    });
}
