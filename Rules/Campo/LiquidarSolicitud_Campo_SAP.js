/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function LiquidarSolicitud_Campo_SAP(context) {

    //falta validar que el campo de contraseña si este diligenciado
    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let clientData = context.evaluateTargetPathForAPI('#Page:Autorizar_Solicitud_Campo').getClientData();

    let info_user = clientData_user.info_user;
    let info_solicitud = context.binding;
    let orden = info_solicitud.orden;
    let id_solicitud = info_solicitud.id;
    clientData.id_solicitud = id_solicitud
    let reserva = info_solicitud.reserva;
    let centro = info_solicitud.alm_centro;
    let alm_desc = info_solicitud.alm_desc;
    let pass = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Campo/#Control:pass/#Value");
    const pageProxy = context.getPageProxy();

    let exitosos = [];
    let errores = [];
    let liquidar = [];
    let update = [];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let filtro = `$expand=material,almacen,material/und&$filter=solicitud_id eq ${id_solicitud} and posicion ne null and aprobado eq true and doc_material eq null`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
        if (!results || results.length === 0) {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Componentes liquidados",
                    "Message": "Todos los componentes de esta solicitud ya se encuentran liquidados en la reserva."
                }
            })
        }

        // Crear las promesas para cada componente
        for (const e of results) {
            const data = {
                Material: e.material_material.replace(/^0+/, ''),
                MOVE_TYPE: "261",
                Plant: e.almacen.centro,
                StgeLoc: e.almacen.almacen,
                EntryQnt: `${e.cantidad_aprobada}`,
                EntryUom: e.material.und.und_vz,
                RES_ITEM: e.posicion,
                RESERV_NO: reserva
            };

            //alert(JSON.stringify(e));

            try {
                const res = await context.executeAction({
                    "Name": "/appconsumos_mb/Actions/Call_LiquidarMaterialRes.action",
                    "Properties": {
                        "ShowActivityIndicator": true,
                        "ActivityIndicatorText": "Cargando datos ...",
                        "OnFailure": "",
                        "OnSuccess": "",
                        "Target": {
                            "Service": "/appconsumos_mb/Services/backend_REST.service",
                            "Path": "/LiquidarMaterialRes",
                            "RequestProperties": {
                                "Method": "POST",
                                "Body": {
                                    "username": info_user.sapUsr,
                                    "password": pass,
                                    "data": data
                                }
                            }
                        }
                    }
                })
                //actualizar el inventario de la bd tambien

                const resjson = res.data;
                //alert(resjson.doc_material)
                if (resjson.success) {
                    exitosos.push(`${e.material.material_desc}`);
                    update.push({
                        idComponente: e.id,
                        readLink: e["@odata.readLink"],
                        material_desc: e.material.material_desc,
                        material: e.material_material,
                        doc_material: resjson.doc_material,
                        almacen: e.almacen.almacen,
                        centro: e.almacen.centro,
                        sociedad: e.almacen.sociedad,
                        cant: e.cantidad_aprobada,
                    });
                } else {
                    errores.push(`${e.material.material_desc}: ${resjson.message}`);
                }
            } catch (error) {
                //alert(error);
                //agregar validacion autenticacion
                errores.push(`${e.material.material_desc}: ${error?.message || error}`);
            }

            //await sleep(1000); // Esperar 2 segundos antes de la próxima iteración
        }

        //alert(JSON.stringify(update))
        //alert(JSON.stringify(liquidar))
        let promises = update.map(material => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/oData/Update_ComponentesSolicitudApp.action",
                "Properties": {
                    "Target": {
                        "ReadLink": material.readLink
                    },
                    "Properties": {
                        "id": material.idComponente,
                        "doc_material": material.doc_material,
                        "cantidad_aprobada": material.cant,
                        "aprobado": true,
                        "confirmacion_tec": true
                    }
                }
            }).then(() => {

                let filtroInv = `$filter=material eq '${material.material}' and almacen_almacen eq '${material.almacen}' and almacen_centro eq '${material.centro}' and almacen_sociedad eq '${material.sociedad}'`;
                return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Inventario', [], filtroInv).then(async (results) => {
                    if (results && results.length > 0) {
                        let inventario = results.getItem(0)
                        let nueva_cant = inventario.stock_disponible - material.cant
                        return context.executeAction({
                            "Name": "/appconsumos_mb/Actions/oData/Update_Inventario.action",
                            "Properties": {
                                "Target": {
                                    "ReadLink": inventario["@odata.readLink"]
                                },
                                "Properties": {
                                    "stock_disponible": nueva_cant
                                }
                            }
                        })

                    }
                })
            }).catch((error) => {
                alert(`Error actualizando material ${material.material}: ${error}`);
            });
        });

        let mensaje = "";

        if (errores.length === 0) {
            //Si esto se cumple cambiar el estado de la solicitud a autorizado y generar el pdf, de lo contrario no se cambia ni se guarda el pdf
            //en el return o resume de la pagina que el boton de autorizar valide si si hay cosas para autoriza si no que quite el boton
            context.executeAction("/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Autorizar_Campo.action")
            mensaje = 'Todos los materiales fueron liquidados correctamente en SAP.';
        } else if (exitosos.length === 0) {
            //context.executeAction("/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Autorizar_Campo.action")
            mensaje = `Solicitud no liquidada. Fallaron todos los materiales:\n\n${errores.join('\n')}. Intentalo nuevamente`;
        } else {
            mensaje = `Liquidación completada con errores:\n${errores.join('\n')}. Intentalo nuevamente`;
        }


        return Promise.allSettled(promises).then(() => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Resultado de la liquidación",
                    "Message": mensaje
                }
            })
        })
    }).catch((error) => {
        alert(`Error general liquidar: ${error.message || JSON.stringify(error)}`);
    });



}
