/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Confirmar_Consumos_Aceite_Diferencial(context) {
    let consumosAprobados = [];
    let exitosos = []; 
    let errores = [];  
    
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Aceite_Diferencial').getClientData();
    let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();

    let listaDeAgregados = clientData.lista_revision_diferencial; 

    listaDeAgregados.forEach(item => {
        const consumoData = {
            clase_mov: item.clase_mov,
            id_componente: item.id,
            posicion: item.posicion,
            readLink: item["@odata.readLink"]
        };
        consumosAprobados.push(consumoData);
    });

    let promisesAprobados = consumosAprobados.map(consumo => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Update_Item_Planillas_Aceite.action",
            "Properties": {
                "Target": {
                    "ReadLink": consumo.readLink
                },
                "Properties": {
                    "id": consumo.id_componente,
                    "clase_mov": consumo.clase_mov,
                    "posicion": consumo.posicion
                }
            }
        }).then(() => {
            
            exitosos.push(`${consumo.id_componente} - ${consumo.clase_mov}`);
        }).catch((error) => {
            alert(`Error actualizando consumo ${consumo.id_componente}:`, error);
            errores.push(`${consumo.id_componente} - ${consumo.clase_mov}`);
        });
    });

    // Procesar los resultados
    return Promise.allSettled([...promisesAprobados]).then(() => {
        let mensaje = '';

        if (errores.length === 0) {
            mensaje = 'Solicitud gestionada correctamente. Todos los consumos de la solicitud fueron gestionados exitosamente.';
        } else if (exitosos.length === 0) {
            mensaje = `Solicitud no gestionada. Falló la gestión de todos los consumos:\n${errores.join('\n')}`;
        } else {
            mensaje = `Solicitud no gestionada parcialmente. Algunos consumos fueron gestionados con éxito.\n\nErrores:\n${errores.join('\n')}`;
        }

        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Resultado",
                "Message": mensaje
            }
        }).then(() => {
            clientDataFiltro.data_planilla_diferencial.estado = 'Aprobado'
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                "NavigateBackToPage": "/appconsumos_mb/Pages/Aceites/Detalle_Aceite_Diferencial.page" 
            });
        }).then(() => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
                "Properties": {
                    "PageToOpen": "/appconsumos_mb/Pages/Aceites/Aprobar_Aceite_Diferencial.page"
                }
            });
        });
       
    });

}
