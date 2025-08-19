/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_List_Abastecimiento(context) {
    let almacen = context.evaluateTargetPath('#Page:Filtro_Almacen_Solicitud_Abast/#Control:FormCellListPicker_Almacen_Reabast/#Value')[0].BindingObject;
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Almacen_Solicitud_Abast').getClientData();
    clientData.almacen_abast = almacen;
    //alert(JSON.stringify(clientData.almacen_abast))
    clientData.materiales_nuevos = []

    let filtro = `$filter=Werks eq '${almacen.centro}' and Spras eq 'ES' and Lgort ne '${almacen.almacen}' and contains(Txtmd, 'BORRADO') eq false&$orderby=Lgort`

    /*context.read('/appconsumos_mb/Services/ZBODEGA_AGO_SRV.service', 'ZBIW_MARDTSet', [], filtro).then(async (results) => {

        clientData.materiales_nuevos = []
        context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
            "Properties": {
                "Message": `Los materiales ya están disponibles. Puedes crear nuevas solicitudes.`,
                "Duration": 1
            }
        });

        if (results && results.length > 0) {
            const materialesUnicos = results.filter(
                (item, index, self) =>
                    index === self.findIndex(m => m.Matnr === item.Matnr)
            );

            clientData.materiales_nuevos = materialesUnicos
            
        }
    }).catch((error) => {

        alert(`Error al obtener los materiales del ERP ${error.message}`)
    });*/

    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Inventario/Lista_Solicitudes_Reabastecimiento.page"
        }
    });
}
