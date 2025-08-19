/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Detalle_Planilla_Consumo(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let calendario_value = pageProxy.getControl("SectionedTable0").getSection("SectionCalendar0").getSelectedDate();
    let fechaHoy = calendario_value.toISOString().split("T")[0];
    clientData.data_planilla_motor = null
    clientData.data_planilla_hidraulico = null
    clientData.data_planilla_diferencial = null
    clientData.data_planilla_reductor = null
    clientData.data_planilla_servotrans = null

    //alert(fechaHoy)

    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData_user.info_user;
    let filtro = `$expand=almacen,operario&$filter=cast('${fechaHoy}', Edm.Date) eq fecha and almacen_almacen eq '${clientData.almacen_aceite_planilla}' and almacen_centro eq '${clientData.centro_aceite_planilla}'`;
    clientData.fecha = fechaHoy;


    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'PlanillasAceites', [], filtro).then(async (results) => {
        if (results && results.length > 0) {
            let resultados = results;

            // Clasificar por material
            if (info.sociedad === 'AI08') {
                resultados.forEach((item) => {
                    const material = item.material;

                    if (material === '1691624') {
                        clientData.data_planilla_motor = item;
                    } else if (material === '1099689') {
                        clientData.data_planilla_hidraulico = item;
                    } else if (material === '1139592') {
                        clientData.data_planilla_diferencial = item;
                    } else if (material === '1139593') {
                        clientData.data_planilla_reductor = item;
                    }
                });
            } else if (info.sociedad === 'AI01') {
                resultados.forEach((item) => {
                    const material = item.material;
                    if (material === '1417680') {
                        clientData.data_planilla_motor = item;
                    } else if (material === '1102612') {
                        clientData.data_planilla_hidraulico = item;
                    } else if (material === '1715879') {
                        clientData.data_planilla_diferencial = item;
                    } else if (material === '1139592') {
                        clientData.data_planilla_reductor = item;
                    } else if (material === '1654068') {
                        clientData.data_planilla_servotrans = item;
                    }
                });
            }
            else {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Error",
                        "Message": `Error al consultar la sociedad`,
                        "OKCaption": "Cerrar"
                    }
                });

            }

            // Navegar a la página después de guardar los datos
            if (info.sociedad === 'AI01') {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                    "Properties": {
                        "PageToOpen": "/appconsumos_mb/Pages/Aceites/Detalle_Planilla_Consumo_Incauca.page"
                    }
                });
            }
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                "Properties": {
                    "PageToOpen": "/appconsumos_mb/Pages/Aceites/Detalle_Planilla_Consumo.page"
                }
            });

        } else {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Sin datos",
                    "Message": "No se encontraron datos para la fecha y almacén seleccionados.",
                    "OKCaption": "Aceptar"
                }
            });
        }
    })
        .catch((error) => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Error",
                    "Message": `Error al consultar datos: ${error.message}`,
                    "OKCaption": "Cerrar"
                }
            });
        });

}
