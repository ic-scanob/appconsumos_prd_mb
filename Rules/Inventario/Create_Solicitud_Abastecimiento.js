/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import guid from '../guid'
export default function Create_Solicitud_Abastecimiento(context) {

    let actionResult = context.getActionResult("Create_SolicitudApp_Abastecimiento");

    let data = JSON.parse(actionResult.data)
    let idSolicitud = data.id

    let clientData = context.evaluateTargetPathForAPI('#Page:Lista_Solicitudes_Reabastecimiento').getClientData();
    let lista_materiales = clientData.lista_materiales;

    // Obtener datos del almacén desde ClientData
    let clientDataAlmacen = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Solicitud_Abast').getClientData();
    let dataAlmacen = clientDataAlmacen.almacen_abast;


    let exitosos = [];
    let errores = [];

    // Create de la solicitud
    let promises = lista_materiales.map(material => {
        let props = {
            id: guid(context),
            solicitud_id: idSolicitud,
            cantidad_tomada: material.cant
        };

        if (material.tipo === "Nuevo") {
            props.mat_nuevo = material.material;
            props.mat_nuevo_desc = material.material_desc;
            props.mat_nuevo_und = material.und;
        } else if (material.tipo === "Registrado") {
            Object.assign(props, {
                material_material: material.material,
                material_almacen: dataAlmacen.almacen,
                material_centro: dataAlmacen.centro,
                material_sociedad: dataAlmacen.sociedad,
                //almacen_sociedad: dataAlmacen.sociedad,
                //almacen_almacen: dataAlmacen.almacen,
                //almacen_centro: dataAlmacen.centro
            });
        }

        return context.executeAction({
            Name: "/appconsumos_mb/Actions/oData/Create_ComponentesSolicitudApp.action",
            Properties: {
                Properties: props
            }
        }).then(() => {
            exitosos.push(`${material.material} (${material.material_desc})`);
        }).catch(() => {
            errores.push(`${material.material} (${material.material_desc})`);
        });
    });

    // Procesar los resultados
    return Promise.allSettled(promises).then(() => {
        let mensaje = '';

        if (errores.length === 0) {
            mensaje = 'Todos los materiales fueron agregados exitosamente a la solicitud.';
        } else if (exitosos.length === 0) {
            mensaje = `Falló la creación de todos los materiales:\n${errores.join('\n')}`;
        } else {
            mensaje = `Algunos materiales fueron agregados con éxito.\n\nErrores:\n${errores.join('\n')}`;
        }

        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Resultado",
                "Message": mensaje
            }
        }).then(() => {
            // Finalmente cerrar el modal
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                "Properties": {
                    "NavigateBackToPage": "/appconsumos_mb/Pages/Inventario/Lista_Solicitudes_Reabastecimiento.page",
                }
            }).then(() => {
                // Finalmente cerrar el modal
                return context.executeAction("/appconsumos_mb/Actions/app_consumos_prd/Service/OnlySyncStartedMessage.action");
            });
        });
    });

}
