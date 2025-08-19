/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_Agregar_Solicitud_Ingenio(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Ingenio').getClientData();
    clientData.lista_materiales = []
    clientData.lista_inventario = []
    clientData.context_binding = context.binding

    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Ingenio').getClientData();
    //alert(JSON.stringify(context.binding))

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'AlmacenesApp', [], `$filter=tipo eq 'INGENIO'`).then(async (results) => {

        if (results && results.length > 0) {
            let filtro = `$filter=Werks eq '${clientDataFiltro.centro_ingenio}' and Spras eq 'ES' and not substringof('BORRADO', Txtmd) and not substringof('BORRAR', Txtmd) and not substringof('BORRAD_', Txtmd) and (`

            results.forEach(e => {
                filtro += `Lgort eq '${e.almacen}' or `
            });

            clientDataFiltro.filtroMaterial = filtro.slice(0, -4) + ")&$orderby=Matnr&$format=json"
            //alert(clientDataFiltro.filtroMaterial)
            //el centro esta indefinido

            await context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_ZBIW_MARDTSet.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando datos inventario...",
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

                for (const item of resjson) {
                    //alert(JSON.stringify(item))

                    resultadoListPicker.push({
                        ObjectCell: {
                            Title: item.Matnr,
                            DisplayDescriptionInMobile: true,
                            Description: item.Txtmd,
                            Subhead: item.Lgort,
                            Footnote: `Disponible: ${item.Labst} ${item.Meins} / Reservado: ${item.Klabs} ${item.Meins}`,
                            PreserveIconStackSpacing: false,
                            Visible: true
                        },
                        ReturnValue: `${item.Lgort} - ${item.Matnr}`,
                        BindingObject: item
                    });

                }

                clientData.lista_inventario = resultadoListPicker
                //alert(JSON.stringify(context.binding))
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                    "Properties": {
                        "ShowActivityIndicator": true,
                        "ActivityIndicatorText": "Cargando datos...",
                        "PageToOpen": "/appconsumos_mb/Pages/Ingenio/Agregar_Solicitud_Ingenio.page",
                        "ModalPage": true,
                        "ModalPageFullscreen": true
                    }
                });

            }).catch((error) => {
                
                if(error != "canceled"){
                    alert(`Error al consultar el inventario: ${error.message || error}`);
                }
                
            });


        }
    }).catch((error) => {

        alert(`Error al obtener los almacenes ${error.message}`)
    });



}
