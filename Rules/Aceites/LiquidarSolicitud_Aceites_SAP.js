/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function LiquidarSolicitud_Aceites_SAP(context) {
    
    //falta validar que el campo de contraseña si este diligenciado
    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();

    let page = context.getPageProxy();
    let titulo = page.getName();
    let info_solicitud;
    let pagina_Detalle;

    if (titulo == "Aprobar_Aceite_Motor" ){
        info_solicitud = clientData.data_planilla_motor;
        pagina_Detalle = "Detalle_Aceite_Motor"
    }
    if (titulo == "Aprobar_Aceite_Diferencial" ){
        info_solicitud = clientData.data_planilla_diferencial;
        pagina_Detalle = "Detalle_Aceite_Diferencial"
    }
    if (titulo == "Aprobar_Aceite_Hidraulico" ){
        info_solicitud = clientData.data_planilla_hidraulico;
        pagina_Detalle = "Detalle_Aceite_Hidraulico"
    }
    if (titulo == "Aprobar_Aceite_Reductor" ){
        info_solicitud = clientData.data_planilla_reductor;
        pagina_Detalle = "Detalle_Aceite_Reductor"
    }
    if (titulo == "Aprobar_Aceite_Servotransmisor" ){
        info_solicitud = clientData.data_planilla_servotrans;
        pagina_Detalle = "Detalle_Aceite_Servotransmisor"
    }
    
    let id_solicitud = info_solicitud.id;
    let info_user = clientData_user.info_user;

    let material = info_solicitud.material;
    let sociedad = info_solicitud.almacen_sociedad
    let centro;
    let almacen;
    //clientData.id_solicitud = id_solicitud;
    const pageProxy = context.getPageProxy();

    let exitosos = [];
    let errores = [];
    let liquidar = [];
    let update = [];
    var data = {}

    if(sociedad === "AI01"){
        almacen = "407"
        centro = "2000"
    }
    if(sociedad === "AI08"){
        almacen = "406"
        centro = "2200"
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let filtro = `$filter=planilla_id eq ${id_solicitud} and doc_material eq null`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro).then(async (results) => {
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
            if (e.tipo === "Cambio"){
                data = {
                    Material: material,
                    MOVE_TYPE: e.clase_mov,
                    Plant: centro,
                    StgeLoc: almacen,
                    EntryQnt: `${e.consumo}`,
                    ORDERID: "",
                    SGTXT: e.obs_text,
                    BKTXT: e.op_ficha,
                    RES_ITEM : e.posicion,
                    RESERV_NO : e.reserva,
                    EntryUom : ""
                };
            }
            if (e.tipo === "Full"){
                data = {
                    Material: material,
                    MOVE_TYPE: e.clase_mov,
                    Plant: centro,
                    StgeLoc: almacen,
                    EntryQnt: `${e.consumo}`,
                    ORDERID: e.equipo_equipo,
                    SGTXT: e.obs_text,
                    BKTXT: e.op_ficha,
                    RES_ITEM : "",
                    RESERV_NO : "",
                    EntryUom : ""
                };
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
                                    "username": info_user.sapUsr,
                                    "password": "Abaper072025",
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
                    exitosos.push(`${material}`);
                    update.push({
                        idComponente: e.id,
                        readLink: e["@odata.readLink"],
                        material: material,
                        doc_material: resjson.doc_material,
                        almacen: almacen,
                        centro: centro,
                        sociedad: sociedad,
                    });
                } else {
                    errores.push(`${material}: ${resjson.message}`);
                }
            } catch (error) {
                //alert(error);
                //agregar validacion autenticacion
                errores.push(`${material}: ${error?.message || error}`);
            }

            //await sleep(1000); // Esperar 2 segundos antes de la próxima iteración
        }

        //alert(JSON.stringify(update))
        //alert(JSON.stringify(liquidar))
        let promises = update.map(material => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/oData/Update_Item_Planillas_Aceite.action",
                "Properties": {
                    "Target": {
                        "ReadLink": material.readLink
                    },
                    "Properties": {
                        "id": material.idComponente,
                        "doc_material": material.doc_material,
                    }
                }
            })
            /* .then(() => {
                

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
            */

        });

        let mensaje = "";

        if (errores.length === 0) {
            //Si esto se cumple cambiar el estado de la solicitud a autorizado y generar el pdf, de lo contrario no se cambia ni se guarda el pdf
            //en el return o resume de la pagina que el boton de autorizar valide si si hay cosas para autoriza si no que quite el boton
            //context.executeAction("/appconsumos_mb/Actions/oData/Update_SolicitudesApp_Autorizar_Campo.action")
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
            }).then(() => {
                // close modal cuando todo salga bien
                if (errores.length === 0) {
                    return context.executeAction({
                        "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                        "Properties": {
                            "NavigateBackToPage": pagina_Detalle
                        }
                    });
                }
                // Si hay errores, navegar de regreso
                return Promise.resolve();
            });
        })
    }).catch((error) => {
        alert(`Error general liquidar: ${error.message || JSON.stringify(error)}`);
    });

}
