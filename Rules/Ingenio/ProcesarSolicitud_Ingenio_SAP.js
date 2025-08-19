/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function ProcesarSolicitud_Ingenio_SAP(context) {
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
    let pass = context.evaluateTargetPath("#Page:Autorizar_Solicitud_Ingenio/#Control:pass/#Value");
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Autorizar_Solicitud_Ingenio').getClientData();
    clientData.id_solicitud = id_solicitud
    //var btn_liquidar = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("FormCellButton1")

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
                Material: e.mat_nuevo.replace(/^0+/, ''),
                Plant: centro,
                Activity: e.op_number,
                GrRcpt: info_solicitud.alm_almacen,
                RequirementQuantity: `${e.cantidad_aprobada}`,
                RequirementQuantityUnit: e.mat_nuevo_und,
            };

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
                    exitosos.push(`${e.mat_nuevo_desc}`);
                    /*liquidar.push({
                        Material: e.mat_nuevo.replace(/^0+/, ''),
                        MOVE_TYPE: "261",
                        Plant: e.almacen.centro,
                        StgeLoc: e.almacen.almacen,
                        EntryQnt: `${e.cantidad_aprobada}`,
                        EntryUom: e.mat_nuevo_und,
                        RES_ITEM: resjson.item,
                        RESERV_NO: reserva
                    });*/
                    update.push({
                        idComponente: e.id,
                        readLink: e["@odata.readLink"],
                        material_desc: e.mat_nuevo_desc,
                        material: e.mat_nuevo,
                        posicion: resjson.item,
                        cant: e.cantidad_aprobada
                    });
                } else {
                    errores.push(`${e.mat_nuevo_desc}: ${resjson.message}`);
                }
            } catch (error) {
                //alert(error);
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
                errores.push(`${e.mat_nuevo_desc}: ${error?.message || error}`);
            }

            //await sleep(1000); // Esperar 2 segundos antes de la próxima iteración
            // Ejecutar todas las promesas
        }

        let mensaje = "";

        if (errores.length === 0) {
            //btn_liquidar.setEnabled(true)
            context.executeAction("/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Autorizar_Ingenio.action") //CREAR
            mensaje = 'Solicitud gestionada correctamente. Los materiales fueron añadidos a la reserva.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud no gestionada. Fallaron todos los materiales:\n\n${errores.join('\n')}`;
        } else {
            mensaje = `Solicitud parcialmente gestionada.\n\nErrores:\n${errores.join('\n')}`;
        }

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
            }).catch( (error) => {
                
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
        })

    }).catch((error) => {
        alert(`Error general: ${error.message || JSON.stringify(error)}`);
    });

}
