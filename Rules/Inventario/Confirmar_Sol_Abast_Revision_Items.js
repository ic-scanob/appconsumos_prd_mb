/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Confirmar_Sol_Abast_Revision_Items(context) {
    //const pageProxy = context.getPageProxy();
    //var materiales = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    let materialesRechazados = [];
    let materialesAprobados = [];
    let exitosos = [];
    let errores = [];
    //let id_solicitud = context.binding.id;
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
    let clientDataAlmacen = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Solicitud_Abast').getClientData();
    let dataAlmacen = clientDataAlmacen.almacen_abast;

    //let filtro = `$expand=material,almacen&$filter=solicitud_id eq ${id_solicitud}`;
    let listaDeAgregados = clientData.lista_mat_solicitud_abast;

    
    /*var nuevo = {
        id: data.id,
        material: material,
        material_desc: material_desc,
        cant_sol: data.cantidad_tomada,
        cant_apro: 0,
        almacen: null,
        aprobado: 'Rechazado',
        tipo: tipo
    }
    */

    listaDeAgregados.forEach(item => {
        const materialData = {
            descripcion: item.material_desc,
            material: item.material,
            id_componente: item.id,
            readLink: item["@odata.readLink"]
        };
        

        if (item.aprobado === 'Aprobado') {
            materialData.cantidad_aprobada = item.cant_apro;
            materialData.almacen_centro = dataAlmacen.centro,
            materialData.almacen_sociedad= dataAlmacen.sociedad,
            materialData.almacen_almacen =  item.almacen,
            materialesAprobados.push(materialData);
        } else {

            //rechazado
            materialData.cantidad_aprobada = 0;
            materialesRechazados.push(materialData);
        }
    });

    let promisesAprobados = materialesAprobados.map(material => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Update_ComponentesSolicitudApp.action",
            "Properties": {
                "Target": {
                    "ReadLink": material.readLink
                },
                "Properties": {
                    "id": material.id_componente,
                    "almacen_centro": material.almacen_centro,
                    "almacen_sociedad": material.almacen_sociedad,
                    "almacen_almacen": material.almacen_almacen,
                    "cantidad_aprobada": parseFloat(material.cantidad_aprobada) || 0,
                    "aprobado": true
                }
            }
        }).then(() => {
            exitosos.push(`${material.material} - ${material.descripcion}`);
        }).catch((error) => {
            alert(`Error actualizando material ${material.material}:`, error);
            errores.push(`${material.material} - ${material.descripcion}`);
        });
    });
    let promisesRechazados = materialesRechazados.map(material => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Update_ComponentesSolicitudApp.action",
            "Properties": {
                "Target": {
                    "ReadLink": material.readLink
                },
                "Properties": {
                    "id": material.id_componente,
                    "cantidad_aprobada": 0,
                    "aprobado": false,
                    "confirmacion_tec": false
                }
            }
        }).then(() => {
            exitosos.push(`${material.material} - ${material.descripcion}`);
        }).catch((error) => {
            alert(`Error actualizando material ${material.material}:`, error);
            errores.push(`${material.material} - ${material.descripcion}`);
        });
    });

    // Procesar los resultados
    return Promise.allSettled([...promisesAprobados, ...promisesRechazados]).then(() => {
        let mensaje = '';

        if (errores.length === 0) {
            mensaje = 'Solicitud gestionada correctamente. Todos los materiales de la solicitud fueron gestionados exitosamente.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud no gestionada. Falló la gestión de todos los materiales:\n${errores.join('\n')}`;
        } else {
            mensaje = `Solicitud no gestionada parcialmente. Algunos materiales fueron gestionados con éxito.\n\nErrores:\n${errores.join('\n')}`;
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
