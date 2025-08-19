import guid from '../guid'

/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Create_Componentes_Solicitud(context) {
    let actionResult = context.getActionResult("Create_Solicitud_Campo")
    let data = JSON.parse(actionResult.data)
    let idSolicitud = data.id

 
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Campo').getClientData();
    let lista_materiales = clientData.lista_materiales;
 
    // Obtener datos del almacén desde ClientData
    let dataAlmacen = context.evaluateTargetPath('#Page:Filtro_Campo/#Control:almacen_campo/#Value')[0].BindingObject 
 
    let exitosos = [];
    let errores = [];
 
    // Create de la solicitud
    let promises = lista_materiales.map(material => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Create_ComponentesSolicitudApp.action",
            "Properties": {
                "Properties": {
                    "id": guid(context),
                    "material_material": material.material,
                    "material_almacen": material.almacen.almacen,
                    "material_centro": material.almacen.centro,
                    "material_sociedad": material.almacen.sociedad,
                    "almacen_sociedad": material.almacen.sociedad,
                    "almacen_almacen": material.almacen.almacen,
                    "almacen_centro": material.almacen.centro,
                    "solicitud_id": idSolicitud,
                    "cantidad_tomada": material.cant
                }
            }
        }).then(() => {
            exitosos.push(`${material.almacen.almacen_desc} - ${material.material_desc}`);
        }).catch(() => {
            errores.push(`${material.almacen.almacen_desc} - ${material.material_desc}`);
        });
    });
 
    // Procesar los resultados
    return Promise.allSettled(promises).then(() => {
        let mensaje = '';
 
        if (errores.length === 0) {
            mensaje = 'Solicitud creada. Todos los materiales fueron agregados exitosamente a la solicitud.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud creada. Falló la creación de todos los materiales:\n${errores.join('\n')}`;
        } else {
            mensaje = `Solicitud creada. Algunos materiales fueron agregados con éxito.\n\nErrores:\n${errores.join('\n')}`;
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
                "NavigateBackToPage": "/appconsumos_mb/Pages/Campo/Detalle_Orden_Campo.page"
            });
        });
    });


}
