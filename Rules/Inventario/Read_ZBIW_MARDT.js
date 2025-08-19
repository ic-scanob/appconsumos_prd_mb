/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Read_ZBIW_MARDT(context) {
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Solicitud_Abast').getClientData();
    const pageProxy = context.getPageProxy();
    var agregarMaterialExistente = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell1")
    var agregarMaterialNuevo = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell2")

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'AlmacenesApp', [], `$filter=sociedad eq '${clientDataFiltro.almacen_abast.sociedad}' and almacen ne '${clientDataFiltro.almacen_abast.almacen}'`).then(async (results) => {

        if (results && results.length > 0) {
            let filtro = `$filter=Werks eq '${clientDataFiltro.almacen_abast.centro}' and Spras eq 'ES' and not substringof('BORRADO', Txtmd) and not substringof('BORRAR', Txtmd) and not substringof('BORRAD_', Txtmd) and (`

            results.forEach(e => {
                filtro += `Lgort eq '${e.almacen}' or `
            });

            clientDataFiltro.filtroMaterial = filtro.slice(0, -4) + ")&$orderby=Matnr&$format=json"
            //return context.executeAction("/appconsumos_mb/Actions/oData/Read_ZBIW_MARDTSet.action");
            const res = await context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_ZBIW_MARDTSet.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando datos ...",
                    "OnFailure": "",
                    "OnSuccess": "",
                    "Target": {
                        "Service": "/appconsumos_mb/Services/ZBODEGA_AGO_SRV.service",
                        "Path": `/ZBIW_MARDTSet?${clientDataFiltro.filtroMaterial}`,
                        "RequestProperties": {
                            "Method": "GET"
                        }
                    }
                }
            }).then((res) => {
                const resjson = res.data.d.results;
                //alert(JSON.stringify(resjson[0]));

                const resultadoListPicker = [];
                const vistos = new Set();

                for (const item of resjson) {
                    if (!vistos.has(item.Matnr)) {
                        vistos.add(item.Matnr);
                        resultadoListPicker.push({
                            ObjectCell: {
                                Title: item.Matnr,
                                Description: item.Txtmd,
                                StatusText: item.Meins,
                                PreserveIconStackSpacing: false,
                                Visible: true
                            },
                            ReturnValue: item.Matnr
                        });
                    }
                }

                clientDataFiltro.materiales_nuevos = resultadoListPicker

                agregarMaterialExistente.setVisible(false)
                agregarMaterialNuevo.setVisible(true)
                agregarMaterialNuevo.redraw(true)

            }).catch((error) => {
                alert(`Error al consultar el inventario: ${error.message || error}`);
            });

        }
    }).catch((error) => {

        alert(`Error al obtener los almacenes ${error.message}`)
    });
}
