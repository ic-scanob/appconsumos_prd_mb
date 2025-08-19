/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default async function Confirmar_Solicitud_Revision_Items_Ingenio(context) {
    const pageProxy = context.getPageProxy();
    var materiales = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    let materialesRechazados = [];
    let materialesAprobados = [];
    let exitosos = [];
    let errores = [];
    let id_solicitud = context.binding.id;
    let operacion = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:operacion/#Value')
 

    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitudes_Ingenio').getClientData();
    let filtro = `$expand=material,almacen&$filter=solicitud_id eq ${id_solicitud}`;

    //let listaDeAgregados = clientData.lista_mat_solicitud_ing;

    if (materiales.getVisible()) {
        //cuando los materiales fueron aprobados por item

        let listaDeAgregados = clientData.lista_mat_solicitud_ing;

        listaDeAgregados.forEach(item => {
            const materialData = {
                descripcion: item.mat_nuevo_desc,
                material: item.mat_nuevo,
                almacen_centro: item.almacen.centro,
                almacen_sociedad: item.almacen.sociedad,
                almacen_almacen: item.almacen_almacen,
                id_componente: item.id,
                readLink: item["@odata.readLink"]
            };

            if (item.aprobado === 'Aprobado') {
                materialData.cantidad_aprobada = item.cant;
                materialData.operacion = item.operacion;
                materialesAprobados.push(materialData);
            } else {
               
                //rechazado
                materialData.cantidad_aprobada = 0;
                materialesRechazados.push(materialData);
            }
        });

    } else {
        //cuando se aprueban todos los materiales por defecto
        await context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
            if (results && results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    let item = results.getItem(i);
                    materialesAprobados.push({
                        descripcion: item.mat_nuevo_desc,
                        material: item.mat_nuevo,
                        almacen_centro: item.almacen.centro,
                        almacen_sociedad: item.almacen.sociedad,
                        almacen_almacen: item.almacen.almacen,
                        id_componente: item.id,
                        operacion: operacion[0].ReturnValue,
                        cantidad_aprobada: item.cantidad_tomada,
                        readLink: item["@odata.readLink"]
                    });
                }
            } else {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Error",
                        "Message": "Error al tratar de traer los componentes de la solicitud (Aprobar componentes)"
                    }
                })
            }
        }).catch((error) => {
            alert(`Error ${error.message}`);
        });


    }

    let promisesAprobados = materialesAprobados.map(material => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Update_ComponentesSolicitudApp.action",
            "Properties": {
                "Target": {
                    "ReadLink": material.readLink
                },
                "Properties": {
                    "id": material.id_componente,
                    "cantidad_aprobada": material.cantidad_aprobada,
                    "aprobado": true,
                    "op_number" : material.operacion
                }
            }
        }).then(() => {
            exitosos.push(`${material.material} - ${material.descripcion}`);
        }).catch((error) => {
            alert(`Error actualizando material ${material.material}:`, error);
            errores.push(`${material.material} - ${material.descripcion}`);
        });
    });

    let promisesRechazados = materialesRechazados.map(material => {
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
                    "confirmacion_tec": false,
                    "op_number" : null
                }
            }
        }).then(() => {
            exitosos.push(`${material.material} - ${material.descripcion}`);
        }).catch((error) => {
            alert(`Error actualizando material ${material.material}:`, error);
            errores.push(`${material.material} - ${material.descripcion}`);
        });
    });

    // Procesar los resultados
    return Promise.allSettled([...promisesAprobados, ...promisesRechazados]).then(() => {
        let mensaje = '';

        if (errores.length === 0) {
            mensaje = 'Solicitud gestionada correctamente. Todos los materiales de la solicitud fueron gestionados exitosamente.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud no gestionada. Falló la gestión de todos los materiales:\n${errores.join('\n')}`;
        } else {
            mensaje = `Solicitud no gestionada parcialmente. Algunos materiales fueron gestionados con éxito.\n\nErrores:\n${errores.join('\n')}`;
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
                "NavigateBackToPage": "/appconsumos_mb/Pages/Ingenio/Detalle_Solicitudes_Ingenio.page"
            })
        });
    });
}
