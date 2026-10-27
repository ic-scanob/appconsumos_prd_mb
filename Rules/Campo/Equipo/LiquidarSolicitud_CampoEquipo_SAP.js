/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function LiquidarSolicitud_CampoEquipo_SAP(context) {
    //Paso 1. Liquidar, dar el numero de documento y ademas actualizar la posicion
    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    //let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();

    let clientData = context.evaluateTargetPathForAPI('#Page:Autorizar_Solicitud_CampoEquipo').getClientData();


    let info_solicitud = context.binding;
    let id_solicitud = info_solicitud.id;
    clientData.id_solicitud = id_solicitud

    const password_SAP = context.evaluateTargetPath("#Page:Autorizar_Solicitud_CampoEquipo/#Control:pass/#Value");

    let info_user = clientData_user.info_user;
    let usuario_SAP = info_user.sapUsr
    let data;
    let exitosos = [];
    let errores = [];
    let update = [];
    let filtro = `$expand=material,almacen,material/und&$filter=solicitud_id eq ${id_solicitud} and posicion eq null and aprobado eq true and doc_material eq null`;

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
        //alert(JSON.stringify(results))



        // Crear las promesas para cada componente
        for (const e of results) {
            data = {
                Material: e.material_material.replace(/^0+/, ''),
                MOVE_TYPE: "Y49",
                Plant: e.almacen.centro,
                StgeLoc: e.almacen.almacen,
                EntryQnt: `${e.cantidad_aprobada}`,
                ORDERID: info_solicitud.equipo_solicitud,
                SGTXT: info_solicitud.observaciones_tec,
                BKTXT: info_solicitud.op_ficha,
                RES_ITEM: "",
                RESERV_NO: "",
                EntryUom: ""
            }

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
                                    "username": usuario_SAP,
                                    "password": password_SAP,
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
                //alert(error?.message || error)
            }

            //await sleep(1000); // Esperar 2 segundos antes de la próxima iteración
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
                        "doc_material": material.doc_material,
                        "cantidad_aprobada": material.cant,
                        "aprobado": true,
                        "confirmacion_tec": true
                    }
                }
            }).then(() => {

                let filtroInv = `$filter=material eq '${material.material}' and almacen_almacen eq '${material.almacen}' and almacen_centro eq '${material.centro}' and almacen_sociedad eq '${material.sociedad}'`;
                // Ver qué filtro se está armando
                //alert(`Filtro inventario: ${filtroInv}`);
                return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Inventario', [], filtroInv).then(async (results) => {
                    //alert(`Registros inventario encontrados: ${results ? results.length : 'null'}`);

                    if (results && results.length > 0) {
                        let inventario = results.getItem(0)
                        let nueva_cant = inventario.stock_disponible - material.cant
                        // Ver los valores antes de actualizar
                        //alert(`Inventario encontrado - stock_disponible: ${inventario.stock_disponible}, cant a restar: ${material.cant}, nueva_cant: ${nueva_cant}, readLink: ${inventario["@odata.readLink"]}`);

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

                    } else {
                        alert(`No se encontró inventario para material: ${material.material}, almacen: ${material.almacen}, centro: ${material.centro}, sociedad: ${material.sociedad}`);
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
            context.executeAction("/appconsumos_mb/Actions/oData/Equipo/Update_SolicitudesApp_Autorizar_CampoEquipo.action")
            mensaje = 'Todos los materiales fueron liquidados correctamente en SAP.';

        } else if (exitosos.length === 0) {
            //context.executeAction("/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Autorizar_CampoEquipo.action")
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
