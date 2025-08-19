/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function ConfirmarMaterialesItems_Abast(context) {
    const pageProxy = context.getPageProxy();
    var table = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")
    var items = table.getSelectedItems()
    var cant = table.getSelectedItemsCount()

    let exitosos = [];
    let errores = [];


    let promisesConfirmados = items.map(e => {
        let item = e.binding
        let desc = ""
        let idMaterial = ""
        if(typeof item.mat_nuevo_desc === 'string'){
            desc= item.mat_nuevo_desc
            idMaterial=item.mat_nuevo
        }
        if(typeof item.material?.material_desc === 'string'){
            desc= item.material.material_desc
            idMaterial=item.material_material
        }
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Update_ComponentesSolicitudApp.action",
            "Properties": {
                "Target": {
                    "ReadLink": item["@odata.readLink"]
                },
                "Properties": {
                    "id": item.id,
                    "confirmacion_tec": true,
                    "aprobado": true,
                    "cantidad_aprobada":item.cantidad_aprobada
                }
            }
        }).then(() => {
            exitosos.push(`${idMaterial} - ${desc}`);
        }).catch((error) => {
            //alert(`Error actualizando material ${idMaterial}:`, error);
            errores.push(`${idMaterial} - ${desc}`);
        });
    });
    

    // Procesar los resultados
    return Promise.allSettled(promisesConfirmados).then(() => {
        let mensaje = '';

        if (errores.length === 0) {
            mensaje = 'Solicitud gestionada correctamente. Los materiales fueron confirmados exitosamente.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud no gestionada. Falló la confirmación de todos los materiales:\n${errores.join('\n')}`;
        } else {
            mensaje = `Solicitud no gestionada parcialmente. Algunos materiales fueron confirmados con éxito.\n\nErrores:\n${errores.join('\n')}`;
        }

        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Resultado",
                "Message": mensaje
            }
        }).then(() => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                "NavigateBackToPage": "/appconsumos_mb/Pages/Inventario/Detalle_Solicitud_Reabastecimieto.page"
            });
        });
    });
}
