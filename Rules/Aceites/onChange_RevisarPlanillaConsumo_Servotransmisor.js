/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default async function onChange_RevisarPlanillaConsumo_Servotransmisor(context) {
    const pageProxy = context.getPageProxy();
    var form_cell = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")

    var form_cell_dos = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell2")

    //var registro_consumo = form_cell.getControl("registro_consumo")
    var orden_obj = form_cell.getControl("orden_obj")
    var pos_obj = form_cell_dos.getControl("pos_obj")

    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let material = clientData.data_planilla_servotrans.material
    let clientDataDetalle = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Servotransmisor').getClientData();

    let registro_consumo_value = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Servotransmisor/#Control:registro_consumo/#Value');

    //alert(JSON.stringify(orden_obj.getTargetSpecifier()))

    //alert(JSON.stringify(res))
    //alert(JSON.stringify(orden_obj.getTargetSpecifier()))

    //alert(target.getType())
    //setTargetSpecifier(,true)

    orden_obj.setValue("")
    if (registro_consumo_value.length > 0) {

        orden_obj.redraw()
        pos_obj.redraw()

        if (registro_consumo_value[0].BindingObject.tipo === "Cambio") {
            pos_obj.setVisible(true);
            orden_obj.setVisible(false);
            pos_obj.redraw()
            let orden = registro_consumo_value[0].BindingObject.orden_orden
            pos_obj.redraw()
            //aqui va lo de la pos
            const res = await context.executeAction({
                "Name": "/appconsumos_mb/Actions/Call_ZAMMST_ORDRINSUSet.action",
                "Properties": {
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText": "Cargando datos ...",
                    "OnFailure": "",
                    "OnSuccess": "",
                    "Target": {
                        "Service": "/appconsumos_mb/Services/ZAMANAGE_LOGISTIC.service",
                        "Path": `/getcompreserSet?$filter=(Aufnr eq '${orden}' and Matnr eq '${material}')&$orderby=Rspos&$format=json`,
                        "RequestProperties": {
                            "Method": "GET"
                        }
                    }
                }
            })

            const resjson = res.data.d.results;
            //alert(JSON.stringify(resjson))

            const resultadoListPicker = [];

            for (const item of resjson) {
                var solicitada = item.Bdmng
                var tomada = item.Enmng
                var unidad = item.Meins
                let disponible = parseFloat(solicitada) - parseFloat(tomada);
                let value_disponible;
                if (disponible > 0) {
                    value_disponible = `Disponible: ${disponible} ${unidad}`;
                } else {
                    value_disponible = "No hay cantidad disponible";
                }
                resultadoListPicker.push({
                    ObjectCell: {
                        Title: `Pos: ${item.Rspos}`,
                        Subhead: `Material: ${item.Matnr}`,
                        StatusText: `Cant sol: ${item.Bdmng}`,
                        Description: `Reserva: ${item.Rsnum}`,
                        SubstatusText: `Cant tomada: ${item.Enmng}`,
                        Footnote: value_disponible,
                        PreserveIconStackSpacing: false,
                        Visible: true
                    },
                    ReturnValue: item.Rspos
                });
            }
            //alert(resultadoListPicker)
            clientDataDetalle.materiales_lista = resultadoListPicker
            form_cell_dos.redraw()
            pos_obj.redraw()

        } else {
            pos_obj.setVisible(false);
            orden_obj.setVisible(false);
        }
        return;
    } else {

        pos_obj.setVisible(false);
        orden_obj.setVisible(false);
        orden_obj.redraw()
        pos_obj.redraw()

        return;
    }
}
