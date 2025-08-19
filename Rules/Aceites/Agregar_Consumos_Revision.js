/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Agregar_Consumos_Revision(context) {
    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Motor').getClientData();
    let registro_consumo_value = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Motor/#Control:registro_consumo/#Value');
    //let clmov_value = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Motor/#Control:orden_obj/#Value');
    
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");

    let clase_mov;
    let posicion;

    if (registro_consumo_value.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Consumo No Seleccionado",
                "Message": `Debes seleccionar un consumo para continuar`
            }
        });

    }
    if (registro_consumo_value[0].BindingObject.tipo === "Cambio") {
        let posicion_value = context.evaluateTargetPath('#Page:Revisar_Planilla_Aceite_Motor/#Control:pos_obj/#Value');
        if (posicion_value.length < 1) {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Posición No Seleccionada",
                    "Message": `Debes seleccionar una posición para continuar`
                }
            });
        }
        clase_mov = "261"
        posicion = posicion_value[0].ReturnValue
    }

    if (registro_consumo_value[0].BindingObject.tipo === "Full") {
        clase_mov = "Y49"
        posicion = null
    }


    let dataConsumo = registro_consumo_value[0].BindingObject

    const duplicado = clientData.lista_revision_motor.filter(m => m.pos === dataConsumo.pos).length > 0

    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Consumo No Agregado",
                "Message": `El consumo ya fue ingresado anteriormente`
            }
        });
    }

    dataConsumo.clase_mov = clase_mov
    dataConsumo.posicion = posicion
    clientData.lista_revision_motor.push(dataConsumo)
    list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Consumo agregado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    });
}
