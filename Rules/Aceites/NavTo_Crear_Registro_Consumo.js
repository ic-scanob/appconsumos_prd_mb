/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import fechaFormateada from '../get_Now_DateTime_Col';
import ayerfecha from '../get_Yest_DateTime_Col';
export default async function NavTo_Crear_Registro_Consumo(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    const almacen_aceites = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value');
    clientData.centro_aceite_registro = almacen_aceites[0].BindingObject.centro
    clientData.almacen_aceite_registro = almacen_aceites[0].BindingObject.almacen
    clientData.sociedad_aceite_registro = almacen_aceites[0].BindingObject.sociedad
    clientData.data_planilla_motor = null
    clientData.data_planilla_hidraulico = null
    clientData.data_planilla_diferencial = null
    clientData.data_planilla_reductor = null
    clientData.data_planilla_servotrans = null
    let clientData_user = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData_user.info_user;

    clientData.esHoy = true

    const dataAlmacen = almacen_aceites[0].BindingObject;
    const fechaHoy = fechaFormateada(context);
    const fechaAyer = ayerfecha(context);

    const filtroAyerPendiente =
        `$filter=cast('${fechaAyer}', Edm.Date) eq fecha and ` +
        `almacen_almacen eq '${dataAlmacen.almacen}' and ` +
        `almacen_centro eq '${dataAlmacen.centro}' and ` +
        `estado eq 'Pendiente'`;

    const resAyer = await context.read(
        '/appconsumos_mb/Services/app_consumos_prd.service',
        'PlanillasAceites',
        [],
        filtroAyerPendiente
    );

    let filtro = `$expand=almacen,operario&$filter=cast('${fechaHoy}', Edm.Date) eq fecha and almacen_almacen eq '${dataAlmacen.almacen}' and almacen_centro eq '${dataAlmacen.centro}'`;

    const hayPendientesAyer = resAyer && resAyer.length > 0;

    if(hayPendientesAyer){
        filtro = `$expand=almacen,operario&$filter=cast('${fechaAyer}', Edm.Date) eq fecha and almacen_almacen eq '${dataAlmacen.almacen}' and almacen_centro eq '${dataAlmacen.centro}'`;
        clientData.esHoy = false
    }
    


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

            //alert("Motor: " + JSON.stringify(clientData.data_planilla_motor));
            //alert("Hidráulico: " + JSON.stringify(clientData.data_planilla_hidraulico));
            //alert("Diferencial: " + JSON.stringify(clientData.data_planilla_diferencial));

            // Navegar a la página después de guardar los datos
            if (info.sociedad === 'AI01') {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                    "Properties": {
                        "PageToOpen": "/appconsumos_mb/Pages/Aceites/Registrar_Planilla_Consumo_Incauca.page"
                    }
                });
            }
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                "Properties": {
                    "PageToOpen": "/appconsumos_mb/Pages/Aceites/Registrar_Planilla_Consumo.page"
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
