import Crear_Solicitud_Reabast_Automatica from "./Crear_Solicitud_Reabast_Automatica";

/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function ProcesarSolicitud_Campo_SAP(context) {
    //1. Enviar los componentes a la orden - hay que validar si ya hay creados materiales con las cantidades solicitadas usar esos campos y no hay que crearlos 
    //   - se debe guardar en los componentes de la solicitud las posiciones en la reserva de los materiales creados o escogidos
    //2. liquidar los componentes de la orden - se debe guardar el numero de documento de material en cada componente y se debe mostrar en el detalle de los items de la solicitud
    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info_user = clientData_user.info_user;
    let info_solicitud = context.binding;
    let orden = info_solicitud.orden;
    let id_solicitud = info_solicitud.id;
    let reserva = info_solicitud.reserva;
    let centro = info_solicitud.alm_centro;
    let alm_desc = info_solicitud.alm_desc;
    let pass = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Campo/#Control:pass/#Value");
    const pageProxy = context.getPageProxy();
    var btn_autorizar = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton0")
    var btn_liquidar = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton1")

    let exitosos = [];
    let errores = [];
    let liquidar = [];
    let update = [];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let filtro = `$expand=material,almacen,material/und&$filter=solicitud_id eq ${id_solicitud} and posicion eq null and aprobado eq true`;
    //traer los componnetes que todavia no tengan una posicion asociada
    //en liquidar traer todos los componentes que tengan una posicion y que no tengan un doc de movimiento 
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtro).then(async (results) => {
        if (!results || results.length === 0) {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Componentes ya registrados",
                    "Message": "Todos los componentes de esta solicitud ya se encuentran registrados en la reserva."
                }
            })
        }

        // Crear las promesas para cada componente
        for (const e of results) {
            const data = {
                ReservNo: reserva.replace(/^0+/, ''),
                Material: e.material_material.replace(/^0+/, ''),
                Plant: centro,
                Activity: e.op_number,
                GrRcpt: alm_desc,
                RequirementQuantity: `${e.cantidad_aprobada}`,
                RequirementQuantityUnit: e.material.und.und_vz,
            };

            //alert(JSON.stringify(e));

            try {
                const res = await context.executeAction({
                    "Name": "/appconsumos_mb/Actions/Call_AddMaterialesRes.action",
                    "Properties": {
                        "ShowActivityIndicator": true,
                        "ActivityIndicatorText": "Cargando datos ...",
                        "OnFailure": "",
                        "OnSuccess": "",
                        "Target": {
                            "Service": "/appconsumos_mb/Services/backend_REST.service",
                            "Path": "/AddMaterialRes",
                            "RequestProperties": {
                                "Method": "POST",
                                "Body": {
                                    "username": info_user.sapUsr,
                                    "password": "Abaper072025",
                                    "data": data
                                }
                            }
                        }
                    }
                });

                const resjson = res.data;
                //alert(resjson.item)
                if (resjson.success) {
                    exitosos.push(`${e.material.material_desc}`);
                    /*liquidar.push({
                        Material: e.material_material.replace(/^0+/, ''),
                        MOVE_TYPE: "261",
                        Plant: e.almacen.centro,
                        StgeLoc: e.almacen.almacen,
                        EntryQnt: `${e.cantidad_aprobada}`,
                        EntryUom: e.material.und.und_vz,
                        RES_ITEM: resjson.item,
                        RESERV_NO: reserva
                    });*/
                    update.push({
                        idComponente: e.id,
                        readLink: e["@odata.readLink"],
                        material_desc: e.material.material_desc,
                        material: e.material_material,
                        posicion: resjson.item,
                        cant: e.cantidad_aprobada
                    });
                } else {
                    errores.push(`${e.material.material_desc}: ${resjson.message}`);
                }
            } catch (error) {
                //error.error.code
                //error.error.message
                //responseCode
                
                if (error?.responseCode === 401) {
                    await context.executeAction({
                      "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                      "Properties": {
                        "Title": "Credenciales inválidas",
                        "Message": "El usuario o la contraseña de SAP son incorrectos. Verifícalos e inténtalo nuevamente. Ten en cuenta que después de 3 intentos fallidos tu usuario será bloqueado."
                      }
                    });
                    return; // ← detiene toda la regla aquí
                  }
                errores.push(`${e.material.material_desc}: ${error?.message || error}`);
            }

            //await sleep(1000); // Esperar 2 segundos antes de la próxima iteración
            // Ejecutar todas las promesas
        }

        let mensaje = "";

        //alert("siguio")
        if (errores.length === 0) {
            btn_liquidar.setEnabled(true)
            btn_autorizar.setEnabled(false)
            mensaje = 'Solicitud gestionada correctamente. Los materiales fueron añadidos a la reserva.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud no gestionada. Fallaron todos los materiales:\n\n${errores.join('\n')}. Intentalo nuevamente`;
        } else {
            mensaje = `Solicitud parcialmente gestionada.\n\nErrores:\n${errores.join('\n')}. Intentalo nuevamente`;
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
                        "posicion": material.posicion,
                        "cantidad_aprobada": material.cant,
                        "aprobado": true,
                    }
                }
            }).catch((error) => {
                alert(`Error actualizando material ${material.material}: ${error}`);
            });
        });


        return Promise.allSettled(promises).then(() => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Resultado de la operación",
                    "Message": mensaje
                }
            })
        }).then(async () => {
            let filtroSolicitud = `$filter=id eq ${id_solicitud}`
            const results = await context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Solicitudes', [], filtroSolicitud);
            if (results.length > 0 && errores.length === 0) {
                let value_reabastecer = results.getItem(0).reabastecer;
                if (value_reabastecer) {
                    //se crea la solicitud de reabastecimiento
                    return Crear_Solicitud_Reabast_Automatica(context);
                }
            }
        })
    }).catch((error) => {
        alert(`Error general: ${error.message || JSON.stringify(error)}`);
    });
}
/*return Promise.allSettled(promesasAddMat).then(() => {
    let mensaje = "";

    if (errores.length === 0) {
        btn_liquidar.setEnabled(true)
        mensaje = 'Solicitud gestionada correctamente. Los materiales fueron añadidos a la reserva.';
    } else if (exitosos.length === 0) {
        mensaje = `Solicitud no gestionada. Fallaron todos los materiales:\n\n${errores.join('\n')}`;
    } else {
        mensaje = `Solicitud parcialmente gestionada.\n\nErrores:\n${errores.join('\n')}`;
    }

    alert(JSON.stringify(liquidar))
    //alert(JSON.stringify(update))

    // Segunda fase: liquidar
    /*
    let exitososLiq = [];
    let erroresLiq = [];
    const promesasLiquidar = liquidar.map((item) => {
        alert(JSON.stringify(item))
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/Call_LiquidarMaterialRes.action",
            "Properties": {
                "OnFailure": "",
                "OnSuccess": "",
                "Target": {
                    "Service": "/appconsumos_mb/Services/backend_REST.service",
                    "Path": "/LiquidarMaterialRes",
                    "RequestProperties": {
                        "Method": "POST",
                        "Body": {
                            "username": info_user.sapUsr,
                            "password": "Abaper072025",
                            "data": item
                        }
                    }
                }
            }
        }).then((res) => {

            alert(JSON.stringify(res))
            let resjson = res.data
            let success = resjson.success
            let doc_material = resjson.doc_material
            if (success) {
                exitososLiq.push(`${item.Material}`);
                update.forEach(u => {
                    if (u.posicion === item.RES_ITEM) {
                        u.doc_material = doc_material;
                    }
                });
            } else {
                erroresLiq.push(`${item.Material}: ${resjson.message}`);
            }
        }).catch((err) => {
            erroresLiq.push(`Error al liquidar material ${item.Material}: ${err.message || err}`);
        });
    });

    return Promise.allSettled(promesasLiquidar).then(() => {
        let mensajeFinal = '';
        if (erroresLiq.length > 0) {
            mensajeFinal = `Liquidación completada con errores:\n${erroresLiq.join('\n')}`;
        } else {
            mensajeFinal = 'Todos los materiales fueron liquidados correctamente en SAP.';
        }

        alert(JSON.stringify(update))
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Resultado de la operación",
                "Message": mensaje
            }
        }).then(() => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {

                    "Title": "Resultado de la liquidación",
                    "Message": mensajeFinal
                }
            }).then(() => {

            });
        });
    });

    */

//Falta actualizar el campo de posicion en los componentes en la bd y luego hacer la otra regla para liquidar
/*return context.executeAction({
    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
    "Properties": {
        "Title": "Resultado de la operación",
        "Message": mensaje
    }
})
});

*/






