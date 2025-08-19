/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Agregar_Planilla_Aceites_Incauca(context) {
    let fichaOperario = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_ficha/#Value');
    // Validar si la ficha existe
    if (!fichaOperario) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes ingresar el número de ficha para continuar`
            }
        });
    }
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Empleados', [], `$filter=ficha eq '${fichaOperario}'`).then((results) => {
        if (!results || results.length === 0) {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Alerta",
                    "Message": `Número de ficha no encontrada. Debes ingresar un número de ficha válido para continuar`
                }
            });
        }

        let material_hidraulico = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_id_material/#Value');
        let cant_hidraulico = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_cant_ini_hid/#Value');
        let material_motor = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_id_mat_motor/#Value');
        let cant_motor = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_cant_ini_motor/#Value');
        let material_dif = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_id_mat_diferen/#Value');
        let cant_dif = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_cant_ini_dif/#Value');
        let material_reduc = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_id_mat_reduc/#Value');
        let cant_reduc = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_cant_ini_reduc/#Value');
        let material_servo = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_id_mat_servotrans/#Value');
        let cant_servo = context.evaluateTargetPath('#Page:Crear_Planilla_Consumo_Incauca/#Control:FormCellSimpleProperty_cant_ini_servotrans/#Value');

        let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();

        // Inicializar lista si no existe
        if (!clientData.lista_aceites) {
            clientData.lista_aceites = [];
        }

        // Función para verificar si un material ya existe en la lista
        function materialYaExiste(materialId) {
            return clientData.lista_aceites.some(item => item.material === materialId);
        }

        // Función para obtener la descripción del material según el tipo
        function obtenerDescripcionMaterial(tipo) {
            const descripciones = {
                'hidraulico': 'ACEITE HIDRAULICO 424 FLUID',
                'motor': 'ACEITE MOBIL 15W-40 FULL PROTEC. MOTOR',
                'diferencial': 'ACEITE MOBILUBE HD 85W-140',
                'reductor': 'ACEITE MOBILUBE HD 80W-90 CAJA',
                'servotrans': 'ACEITE M-MOBILTRANS HD 30 DRUM-L',
            };
            return descripciones[tipo] || '';
        }

        let materialesAgregados = [];
        let materialesDuplicados = [];

        // Agregar material hidráulico si tiene valor y no existe
        if (material_hidraulico && cant_hidraulico) {
            if (!materialYaExiste(material_hidraulico)) {
                clientData.lista_aceites.push({
                    material: material_hidraulico,
                    contador_ini: cant_hidraulico,
                    material_desc: obtenerDescripcionMaterial('hidraulico')
                });
                materialesAgregados.push(`Hidráulico: ${material_hidraulico}`);
            } else {
                materialesDuplicados.push(`Hidráulico: ${material_hidraulico}`);
            }
        }

        // Agregar material motor si tiene valor y no existe
        if (material_motor && cant_motor) {
            if (!materialYaExiste(material_motor)) {
                clientData.lista_aceites.push({
                    material: material_motor,
                    contador_ini: cant_motor,
                    material_desc: obtenerDescripcionMaterial('motor')
                });
                materialesAgregados.push(`Motor: ${material_motor}`);
            } else {
                materialesDuplicados.push(`Motor: ${material_motor}`);
            }
        }

        // Agregar material diferencial si tiene valor y no existe
        if (material_dif && cant_dif) {
            if (!materialYaExiste(material_dif)) {
                clientData.lista_aceites.push({
                    material: material_dif,
                    contador_ini: cant_dif,
                    material_desc: obtenerDescripcionMaterial('diferencial')
                });
                materialesAgregados.push(`Diferencial: ${material_dif}`);
            } else {
                materialesDuplicados.push(`Diferencial: ${material_dif}`);
            }
        }

        // Agregar material reductor si tiene valor y no existe
        if (material_reduc && cant_reduc) {
            if (!materialYaExiste(material_reduc)) {
                clientData.lista_aceites.push({
                    material: material_reduc,
                    contador_ini: cant_reduc,
                    material_desc: obtenerDescripcionMaterial('reductor')
                });
                materialesAgregados.push(`Reductor: ${material_reduc}`);
            } else {
                materialesDuplicados.push(`Reductor: ${material_reduc}`);
            }
        }

        // Agregar material servotrans si tiene valor y no existe
        if (material_servo && cant_servo) {
            if (!materialYaExiste(material_servo)) {
                clientData.lista_aceites.push({
                    material: material_servo,
                    contador_ini: cant_servo,
                    material_desc: obtenerDescripcionMaterial('reductor')
                });
                materialesAgregados.push(`Servotransmisión: ${material_servo}`);
            } else {
                materialesDuplicados.push(`Servotransmisión: ${material_servo}`);
            }
        }

        let cantidadRequerida = 5; // Hidráulico, Motor, Diferencial, Reductor, Servotransmisión
        let cantidadActual = clientData.lista_aceites.length;

        //Verificar primero si ya está completa la lista
        if (cantidadActual >= cantidadRequerida) {
            // Lista ya completa - ir directamente a confirmación de creación
            let mensaje = "Lista completa. ¿Deseas crear las planillas?";

            if (materialesDuplicados.length > 0) {
                mensaje = `Los materiales fueron agregados correctamente.\nLista completa (${cantidadActual}/${cantidadRequerida}). ¿Deseas crear las planillas?`;
            }

            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Confirmación",
                    "Message": mensaje,
                    "OKCaption": "Aceptar",
                    "OnOK": "/appconsumos_mb/Rules/Aceites/Crear_Planillas_Aceites_Incauca.js",
                    "CancelCaption": "Cancelar"
                }
            });
        }

        // Si hay materiales duplicados pero la lista NO está completa
        if (materialesDuplicados.length > 0) {
            let mensajeDuplicados = `Los siguientes materiales ya han sido agregados:\n${materialesDuplicados.join('\n')}`;

            if (materialesAgregados.length > 0) {
                mensajeDuplicados += `\n\nNuevos materiales agregados:\n${materialesAgregados.join('\n')}`;
            }

            mensajeDuplicados += `\n\nMateriales en lista: ${cantidadActual}/${cantidadRequerida}`;

            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Materiales duplicados",
                    Message: mensajeDuplicados,
                    CloseCaption: "Cerrar"
                }
            });
        }

        // Si se agregaron materiales y ahora la lista está completa
        if (materialesAgregados.length > 0 && cantidadActual >= cantidadRequerida) {
            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Lista completa",
                    Message: `Se agregaron:\n${materialesAgregados.join('\n')}\n\nLista completa (${cantidadActual}/${cantidadRequerida}). Creando planillas...`,
                    CloseCaption: "Continuar"
                }
            }).then(() => {
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Confirmación",
                        "Message": "¿Estás seguro de que deseas crear las planillas?",
                        "OKCaption": "Aceptar",
                        "OnOK": "/appconsumos_mb/Rules/Aceites/Crear_Planillas_Aceites_Incauca.js",
                        "CancelCaption": "Cancelar"
                    }
                });
            });
        }

        // Si se agregaron materiales pero la lista aún está incompleta
        if (materialesAgregados.length > 0) {
            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Materiales agregados",
                    Message: `Se agregaron:\n${materialesAgregados.join('\n')}\n\nProgreso: ${cantidadActual}/${cantidadRequerida}\nFaltan ${cantidadRequerida - cantidadActual} materiales más.`,
                    CloseCaption: "Cerrar"
                }
            });
        }

        // Si no se agregó nada nuevo y la lista está incompleta
        return context.executeAction({
            Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
            Properties: {
                Title: "Lista incompleta",
                Message: `Materiales en lista: ${cantidadActual}/${cantidadRequerida}\nDebe agregar ${cantidadRequerida - cantidadActual} materiales más para continuar.`,
                CloseCaption: "Cerrar"
            }
        });

    }).catch((error) => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Error",
                "Message": `Error al validar la ficha: ${error.message}`,
                "CloseCaption": "Cerrar"
            }
        });
    });
}
