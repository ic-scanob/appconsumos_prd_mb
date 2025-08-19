/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_InventarioRevisionAlmacenes(context) {

    let clientData = context.evaluateTargetPathForAPI('#Page:Revision_Solicitud_Reabastecimiento').getClientData();
    return clientData.listaInventario
    /*let clientDataAlm = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Solicitud_Abast').getClientData();
    var inventario_form = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")

    let mat_nuevo = clientData.infoMaterial.mat_nuevo
    let material = clientData.infoMaterial.material_material
    let value = ''

    if (mat_nuevo) {
        value = clientData.infoMaterial.mat_nuevo
    }

    if (material) {
        value = clientData.infoMaterial.material_material.replace(/^0+/, '')
    }

    //let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Ingenio').getClientData();

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'AlmacenesApp', [], `$filter=tipo eq 'INGENIO'`).then(async (results) => {

        if (results && results.length > 0) {
            let filtro = `$filter=Matnr eq '${value}' and Werks eq '${clientDataAlm.almacen_abast.centro}' and Spras eq 'ES' and not substringof('BORRADO', Txtmd) and not substringof('BORRAR', Txtmd) and not substringof('BORRAD_', Txtmd) and (`

            results.forEach(e => {
                filtro += `Lgort eq '${e.almacen}' or `
            });

            //clientDataFiltro.filtroMaterial = filtro.slice(0, -4)+")&$orderby=Matnr"
            //alert(clientDataFiltro.filtroMaterial)
            //el centro esta indefinido
            filtro = filtro.slice(0, -4) + ")&$orderby=Lgort&$format=json"

            await context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_ZBIW_MARDTSet.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando datos ...",
                    "OnFailure": "",
                    "OnSuccess": "",
                    "Target": {
                        "Service": "/appconsumos_mb/Services/ZBODEGA_AGO_SRV.service",
                        "Path": `/ZBIW_MARDTSet?${filtro}`,
                        "RequestProperties": {
                            "Method": "GET"
                        }
                    }
                }
            }).then((res) => {
                const resjson = res.data.d.results;
                //alert(JSON.stringify(resjson[0]));

                const resultadoListPicker = [];

                for (const item of resjson) {
                    alert(JSON.stringify(item))

                    resultadoListPicker.push({
                        ObjectCell: {
                            Title: item.Lgort,
                            Description: item.Txtmd,
                            Subhead: item.Matnr,
                            Footnote: `Disponible: ${item.Labst} ${item.Meins} / Reservado: ${item.Klabs} ${item.Meins}`,
                            PreserveIconStackSpacing: false,
                            Visible: true
                        },
                        ReturnValue: item.Lgort,
                        BindingObject: item
                    });

                }

                inventario_form.redraw()
                return resultadoListPicker

            }).catch((error) => {
                alert(`Error al consultar el inventario: ${error.message || error}`);
            });


        }
        return [];
    }).catch((error) => {

        alert(`Error al obtener los almacenes ${error.message}`)
    });*/

    //return `$filter=Matnr eq '${value}' and Spras eq 'ES' and contains(Txtmd, 'BORRADO') eq false and contains(Txtmd, 'BORRAR') eq false and contains(Txtmd, 'BORRAD_') eq false and Werks eq '${clientDataAlm.almacen_abast.centro}'&$orderby=Lgort`
}
