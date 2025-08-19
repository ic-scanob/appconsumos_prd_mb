/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Confirmar_Revision_Ingenio(context) {
    const pageProxy = context.getPageProxy();
    var materiales = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    let operacion = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:operacion/#Value')

    let id_solicitud = context.binding.id;
    //let filtro = `$expand=almacen&$filter=solicitud_id eq ${id_solicitud}`;
    let filtro = `$filter=solicitud_id eq ${id_solicitud}`;
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Ingenio').getClientData();
    let listaDeAgregados = clientData.lista_mat_solicitud_ing;


    if (materiales.getVisible()) {
        //validar que si se hayan agregado todos los materiales a la solicitud
        return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
            if (results && results.length > 0) {
                let totalComponentes = results.length;

                if (listaDeAgregados.length == totalComponentes) {
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
                                "Message": "¿Estás seguro de que deseas confirmar la solicitud aprobada por ítems?",
                                "OKCaption": "Aceptar",
                                "OnOK": "/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Confirmar_Ingenio.action",
                                "CancelCaption": "Cancelar"
                            }
                        })
                    }

                } else if (listaDeAgregados.length < totalComponentes) {
                    return context.executeAction({
                        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                        "Properties": {
                            "Title": "Solicitud No Confirmada",
                            "Message": "No puedes confirmar la solicitud hasta que se hayan agregado todos los materiales."
                        }
                    })
                }


            } else {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Error",
                        "Message": "Error al tratar de traer los componentes de la solicitud"
                    }
                })
            }


        }).catch((error) => {
            alert(`Error ${error.message}`);
        });

    } else {
        if (operacion.length < 1) {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Operación no seleccionada",
                    "Message": "Debes seleccionar una operación antes de confirmar. Este campo es obligatorio.",
                    "OKCaption": "Aceptar"
                }
            })
        }

        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Confirmación",
                "Message": "¿Estás seguro de que deseas confirmar la solicitud con las cantidades originales solicitadas y la operación seleccionada?",
                "OKCaption": "Aceptar",
                "OnOK": "/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Confirmar_Ingenio.action",
                "CancelCaption": "Cancelar"
            }
        })

    }

}
