/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

import guid from '../guid'
export default async function Crear_Solicitud_Reabast_Automatica(context) {
    try {
        const info_solicitud = context.binding;
        const id_solicitud_campo = info_solicitud.id;
        const filtroSolicitud = `$filter=id eq ${id_solicitud_campo}`;
        const filtroComponentes = `$filter=solicitud_id eq ${id_solicitud_campo}`;

        // Función optimizada para agrupar por almacén
        function agruparPorAlmacen(lista) {
            return lista.reduce((acc, item) => {
                const almacen = item.almacen_almacen;
                if (!acc[almacen]) {
                    acc[almacen] = [];
                }
                acc[almacen].push(item);
                return acc;
            }, {});
        }

        // Leer solicitud principal
        const resultsSolicitud = await context.read(
            '/appconsumos_mb/Services/app_consumos_prd.service', 
            'Solicitudes', 
            [], 
            filtroSolicitud
        );

        if (resultsSolicitud.length === 0) {
            alert('No se encontró la solicitud');
            return;
        }

        const solicitud = resultsSolicitud.getItem(0);

        // Leer componentes de la solicitud
        const resultsComponentes = await context.read(
            '/appconsumos_mb/Services/app_consumos_prd.service', 
            'ComponentesSolicitud', 
            [], 
            filtroComponentes
        );

        if (resultsComponentes.length === 0) {
            alert('No se encontraron componentes para la solicitud');
            return;
        }

        // Agrupar componentes por almacén
        const componentesAgrupados = agruparPorAlmacen(resultsComponentes);
        const almacenes = Object.keys(componentesAgrupados);

        // Procesar cada almacén en paralelo
        const promesasSolicitudes = almacenes.map(async (almacen) => {
            const itemsDelAlmacen = componentesAgrupados[almacen];
            
            try {
                // Crear solicitud de abastecimiento
                let id_creacion = guid(context)
                const nuevaSolicitud = await context.executeAction({
                    Name: "/appconsumos_mb/Actions/oData/Create_SolicitudApp_Abastecimiento.action",
                    Properties: {
                        "Properties": {
                            "id": id_creacion,
                            "operario_ficha": solicitud.operario_ficha,
                            "almacen_sociedad": solicitud.almacen_sociedad,
                            "almacen_almacen": almacen,
                            "almacen_centro": solicitud.almacen_centro,
                            "observaciones_tec": `Solicitud creada con reabastecimiento automático de materiales consumidos en CAMPO en el almacén ${solicitud.almacen_almacen}.`,
                            "estado": "Enviado",
                            "correo_creacion": solicitud.correo_creacion,
                            "tipo": "ABASTECIMIENTO"
                        },
                        "OnSuccess": "",
                    },
                   
                });

                //const idSolicitud_reabast = nuevaSolicitud.id;

                // Crear todos los componentes en paralelo
                const promesasComponentes = itemsDelAlmacen.map(async (item) => {
                    
                    
                    const props = {
                        id: guid(context),
                        solicitud_id: id_creacion,
                        cantidad_tomada: item.cantidad_aprobada,
                        material_material: item.material_material,
                        material_almacen: item.material_almacen,
                        material_centro: item.material_centro,
                        material_sociedad: item.material_sociedad,
                    };

                    return context.executeAction({
                        Name: "/appconsumos_mb/Actions/oData/Create_ComponentesSolicitudApp.action",
                        Properties: {
                            Properties: props
                        }
                    });
                });

                // Esperar a que todos los componentes se creen
                const componentesCreados = await Promise.all(promesasComponentes);
                
                return {
                    almacen,
                    solicitud: nuevaSolicitud,
                    componentes: componentesCreados
                };

            } catch (error) {
                alert(`Error procesando almacén ${almacen}: ${error}` );
                throw error;
            }
        });

        // Esperar a que todas las solicitudes se procesen
        const resultados = await Promise.all(promesasSolicitudes);
        
        alert(`Procesamiento completado. Se crearon ${resultados.length} solicitudes de reabastecimiento.`);
        return resultados;

    } catch (error) {
        alert(`Error en Crear_Solicitud_Reabast_Automatica: ${error}` );
        throw error;
    }
}
/*
return context.executeAction({
    Name: "/appconsumos_mb/Actions/oData/Create_SolicitudApp_Abastecimiento.action",
    Properties: {
        "Properties": {
            "id": guid(context),
            "operario_ficha": solicitud.operario_ficha,
            "almacen_sociedad": solicitud.almacen_sociedad,
            "almacen_almacen": "solicitud.almacen_almacen",
            "almacen_centro": solicitud.almacen_centro,
            "observaciones_tec": `Solicitud creada con reabastecimiento automático de materiales consumidos en CAMPO en el almacén ${solicitud.almacen_almacen}.`,
            "estado": "Enviado",
            "correo_creacion": solicitud.correo_creacion,
            "tipo": "ABASTECIMIENTO"
        }
    }
}).then(async () => {
    //Crear los componentes de solicitud de abast con componentes de solicitud de campo
    const resultsComponentes = await context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ComponentesSolicitud', [], filtroComponentes);
    if (resultsComponentes.length > 0) {
        let promises = resultsComponentes.map(material => {
            let props = {
                id: guid(context),
                solicitud_id: idSolicitud_reabast,
                cantidad_tomada: material.cant,
                material_material: material.material,
                material_almacen: dataAlmacen.almacen,
                material_centro: dataAlmacen.centro,
                material_sociedad: dataAlmacen.sociedad,

            };

            return context.executeAction({
                Name: "/appconsumos_mb/Actions/oData/Create_ComponentesSolicitudApp.action",
                Properties: {
                    Properties: props
                }
            })
        });
    }
})
}
*/




