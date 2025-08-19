/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Rechazar_Solicitud_Revision_Componentes_Campo(context) {
    let id_solicitud = context.binding.id;
    let filtro = `$expand=almacen&$filter=solicitud_id eq ${id_solicitud}`;
    let materialesRechazados = [];
    let exitosos = [];
    let errores = [];

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
        if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                let item = results.getItem(i);
                materialesRechazados.push({
                    descripcion: item.material_material,
                    material: item.material_material,
                    almacen_centro: item.almacen.centro,
                    almacen_sociedad: item.almacen.sociedad,
                    almacen_almacen: item.almacen.almacen,
                    id_componente: item.id,
                    readLink: item["@odata.readLink"]
                });
            }
        } else {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Error",
                    "Message": "Error al tratar de traer los componentes de la solicitud (Rechazar componentes)"
                }
            })
        }

        let promises = materialesRechazados.map(material => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/oData/Update_ComponentesSolicitudApp.action",
                "Properties": {
                    "Target": {
                        "ReadLink": material.readLink
                    },
                    "Properties": {
                        "id": material.id_componente,
                        "cantidad_aprobada": 0,
                        "aprobado": false,
                        "confirmacion_tec": false
                    }
                }
            }).then(() => {
                exitosos.push(`${material.material} - ${material.descripcion}`);
            }).catch((error) => {
                alert(`Error updating material ${material.material}:`, error);
                errores.push(`${material.material} - ${material.descripcion}`);
            });
        });

        // Procesar los resultados
        return Promise.allSettled(promises).then(() => {
            let mensaje = '';

            if (errores.length === 0) {
                mensaje = 'Solicitud Rechazada correctamente. Todos los materiales de la solicitud fueron rechazados exitosamente.';
            } else if (exitosos.length === 0) {
                mensaje = `Solicitud rechazada. Falló el rechazo de todos los materiales:\n${errores.join('\n')}`;
            } else {
                mensaje = `Solicitud rechazada parcialmente. Algunos materiales fueron rechazados con éxito.\n\nErrores:\n${errores.join('\n')}`;
            }

            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Resultado",
                    "Message": mensaje
                }
            }).then(() => {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                    "NavigateBackToPage": "/appconsumos_mb/Pages/Campo/Detalle_Solicitudes_Campo.page"
                });
            });
        });

    }).catch((error) => {
        alert(`Error ${error.message}`);
    });
}
