/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import guid from '../guid'
export default function Crear_Planillas_Aceites(context) {

    let fichaOperario = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo/#Control:FormCellSimpleProperty_ficha/#Value');
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let listaAceites = clientData.lista_aceites
    

    if (!listaAceites || listaAceites.length === 0) {
        return context.executeAction({
            Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
            Properties: {
                Title: "Sin materiales",
                Message: "No hay materiales en la lista para crear planillas.",
                CloseCaption: "Cerrar"
            }
        });
    }

    let exitosos = [];
    let errores = [];
    
    // Función para crear planillas secuencialmente
    function crearPlanillasSecuencial(materiales, index = 0) {
        if (index >= materiales.length) {
            // Todas las planillas procesadas, mostrar resultado
            return mostrarResultado();
        }
        
        let material = materiales[index];
        
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/oData/Create_Planilla_Aceites.action",
            "Properties": {
                "Properties": {
                    "id": guid(context),
                    "numero": parseInt(clientData.aceite_num_planilla, 10),
                    "fecha": new Date().toISOString().split('T')[0],
                    "almacen_sociedad": clientData.sociedad_aceite_planilla, 
                    "almacen_almacen": clientData.almacen_aceite_planilla,  
                    "almacen_centro": clientData.centro_aceite_planilla,   
                    "contador_ini": material.contador_ini,
                    "operario_ficha": fichaOperario || "",
                    "material": material.material,
                    "material_desc": material.material_desc, 
                    "estado": "Pendiente"
                }
            }
        }).then((result) => {
            // Planilla creada exitosamente
            exitosos.push(`${material.material} - Contador: ${material.contador_ini}`);
            return crearPlanillasSecuencial(materiales, index + 1);
        }).catch((error) => {
            // Error al crear planilla
            errores.push(`${material.material} - Error: ${error.message || 'Error desconocido'}`);
            return crearPlanillasSecuencial(materiales, index + 1);
        });
    }
    
    function mostrarResultado() {
        let mensaje = '';
        let titulo = '';

        if (errores.length === 0) {
            // Todas las planillas se crearon exitosamente
            titulo = "Planillas creadas exitosamente";
            mensaje = `Se crearon ${exitosos.length} planillas correctamente:\n\n${exitosos.join('\n')}`;
            
            // Limpiar la lista después de crear las planillas exitosamente
            let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
            clientData.lista_aceites = [];
            
        } else if (exitosos.length === 0) {
            // Todas las planillas fallaron
            titulo = "Error al crear planillas";
            mensaje = `Falló la creación de todas las planillas:\n\n${errores.join('\n')}`;
        } else {
            // Algunas exitosas, algunas con error
            titulo = "Planillas creadas parcialmente";
            mensaje = `Resultados de creación de planillas:\n\nExitosas (${exitosos.length}):\n${exitosos.join('\n')}\n\nErrores (${errores.length}):\n${errores.join('\n')}`;
        }

        return context.executeAction({
            Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
            Properties: {
                Title: titulo,
                Message: mensaje,
                CloseCaption: "Cerrar"
            }
        }).then(() => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/ClosePage.action",
                "NavigateBackToPage": "/appconsumos_mb/Pages/Aceites/Filtro_Aceites.page"
            });
        });
    }

    // Iniciar creación secuencial
    return crearPlanillasSecuencial(listaAceites);
}

