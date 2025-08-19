/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default async function NavTo_ConsultarInv_Almacen(context) {
    let almacen = context.evaluateTargetPath('#Page:Filtro_Almacen_Inventario/#Control:FormCellListPicker_Almacen_Inv/#Value');
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Inventario').getClientData();
    clientData.almacen_inventario = almacen;
    clientData.lista_inv = []
    //alert(JSON.stringify(clientData.almacen_inventario[0]))
    let almacenesSeleccionados = clientData.almacen_inventario;

    if (almacenesSeleccionados && almacenesSeleccionados.length > 0) {
        // Tomar el centro desde el primer almacén
        let centro = almacenesSeleccionados[0].BindingObject.centro;

        // Iniciar filtro
        let filtro = `$filter=Werks eq '${centro}' and Spras eq 'ES' and not substringof('BORRADO', Txtmd) and not substringof('BORRAR', Txtmd) and not substringof('BORRAD_', Txtmd) and (`;

        // Agregar cada almacén con OR
        almacenesSeleccionados.forEach(item => {
            filtro += `Lgort eq '${item.BindingObject.almacen}' or `;
        });

        // Quitar el último " or " y cerrar
        filtro = filtro.slice(0, -4) + `)&$orderby=Matnr&$format=json`;

        // Puedes guardar este filtro en ClientData si lo deseas
        clientData.filtroMaterial = filtro;

        //alert(filtro);

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

            clientData.lista_inv = resjson
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                "Properties": {
                    "PageToOpen": "/appconsumos_mb/Pages/Inventario/Consultar_Inventario_Almacenes.page",
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando datos ..."
                }
            });


        }).catch((error) => {
            alert(`Error al consultar el inventario: ${error.message || error}`);
        });

    } else {
        alert("Error: No se seleccionaron almacenes.");
    }


}
