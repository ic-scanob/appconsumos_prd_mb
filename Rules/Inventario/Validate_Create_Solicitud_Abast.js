/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Validate_Create_Solicitud_Abast(context) {
    let clientDataDetalle = context.evaluateTargetPathForAPI('#Page:Lista_Solicitudes_Reabastecimiento').getClientData();
    clientDataDetalle.lista_materiales
    let ficha = context.evaluateTargetPath('#Page:Agregar_Solicitud_Reabastecimiento/#Control:FormCellSimpleProperty_Ficha/#Value');
    if(ficha){
        return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Empleados', [], `$filter=ficha eq '${ficha}'`).then(async (results) => {
            if (results && results.length > 0) {
                if(clientDataDetalle.lista_materiales && clientDataDetalle.lista_materiales.length > 0 ){
                    return context.executeAction({
                        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                        "Properties": {
                            "Title": "Confirmación",
                            "Message": `¿Estás seguro que quieres crear la solicitud?`,
                            "OKCaption": "Aceptar",
                            "OnOK": "/appconsumos_mb/Actions/oData/Create_SolicitudApp_Abastecimiento.action",
                            "CancelCaption": "Cancelar"
                        }
                    });
                    //return context.executeAction("/appconsumos_mb/Actions/oData/Create_Solicitud_Campo.action");
                }
 
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Alerta",
                        "Message": `Debes ingresar al menos un material a la solicitud para continuar`
                    }
                });
            }
 
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Alerta",
                    "Message": `Número de ficha no encontrada. Debes ingresar un número de ficha válido para continuar`
                }
            });
 
        }).catch((error) => {
           
            alert(`Error al encontrar la ficha ${error.message}`)
        });
 
    }
 
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
        "Properties": {
            "Title": "Alerta",
            "Message": `Debes ingresar el número de ficha para continuar`
        }
    });
    
}
