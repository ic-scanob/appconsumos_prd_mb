import guid from '../guid'
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Create_Componentes_Solicitud_Ingenio(context) {

    let actionResult = context.getActionResult("Create_Solicitud_Ingenio")
    let data = JSON.parse(actionResult.data)
    let idSolicitud = data.id

 
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Ingenio').getClientData();
    let lista_materiales = clientData.lista_materiales;

    // Obtener datos del almacén desde ClientData
    let dataAlmacen = context.evaluateTargetPath('#Page:Filtro_Ingenio/#Control:FormCellListPicker_Almacen_O/#Value')[0].BindingObject 
 
    let exitosos = [];
    let errores = [];

    // Create de la solicitud
        let promises = lista_materiales.map(material => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/oData/Create_ComponentesSolicitudApp.action",
                "Properties": {
                    "Properties": {
                        "id": guid(context),
                        "mat_nuevo": material.Matnr,
                        "mat_nuevo_desc": material.Txtmd,
                        "mat_nuevo_und": material.Meins,
                        "almacen_sociedad": dataAlmacen.sociedad,
                        "almacen_almacen": material.Lgort,
                        "almacen_centro": material.Werks,
                        "solicitud_id": idSolicitud,
                        "cantidad_tomada": material.cant
                    }
                }
            }).then(() => {
                exitosos.push(`${material.Lgort} - ${material.Txtmd}`);
            }).catch(() => {
                errores.push(`${material.Lgort} - ${material.Txtmd}`);
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
                "NavigateBackToPage": "/appconsumos_mb/Pages/Ingenio/Detalle_Orden_Ingenio.page"
            });
        });
    });

}
