/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import guid from '../guid'

export default function Registrar_Items_Aceite_Diferencial(context) {
    try {
        // Obtener valores de los controles
        let equipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:equipo_diferencial/#Value');
        let tipo = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:tipo_diferencial/#Value');
        let kmh = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:kmh_diferencial/#Value');
        let operario_diferencial = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:operario_diferencial/#Value');
        let cont_inicial = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:cont_inicial_diferencial/#Value');
        let cont_final = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:con_final_diferencial/#Value');
        let observaciones = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:observaciones_diferencial/#Value');
        let orden = context.evaluateTargetPath('#Page:Registrar_Aceite_Diferencial/#Control:orden_diferencial/#Value');
        
        let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
        let id_planilla = clientData.data_planilla_diferencial.id;

        // Obtener controles del formulario
        const pageProxy = context.getPageProxy();
        const form_add = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0");
        const btn_agregar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0");

        // Conversión de datos
        let contadorIniNum = parseFloat(cont_inicial) || 0;
        let contadorFinNum = parseFloat(cont_final) || 0;
        let kilometrajeNum = parseFloat(kmh) || 0;
        let operario_diferencialString = String(operario_diferencial) || "";
        let equipoData = null;
        let tipoData = null;
        let observacionesData = null;
        let observacionesTxtData = null;
        let ordenData = null;
        let reservaData = null;

        // Extraer datos de equipo
        if (equipo && Array.isArray(equipo) && equipo.length > 0 && equipo[0] && equipo[0].BindingObject) {
            equipoData = equipo[0].BindingObject.equipo;
        }

        // Extraer datos de tipo
        if (tipo && Array.isArray(tipo) && tipo.length > 0 && tipo[0]) {
            tipoData = tipo[0].DisplayValue;
        }

        // Extraer datos de observaciones
        if (observaciones && Array.isArray(observaciones) && observaciones.length > 0 && observaciones[0]) {
            observacionesData = observaciones[0].ReturnValue;
            observacionesTxtData = observaciones[0].DisplayValue;
        }

        // Validación de campos obligatorios básicos
        if (!equipoData || !tipoData || !kilometrajeNum || !contadorFinNum || !observacionesData) {
            let camposFaltantes = [];
            if (!equipoData) camposFaltantes.push("Equipo");
            if (!tipoData) camposFaltantes.push("Tipo");
            if (!kilometrajeNum) camposFaltantes.push("Kilometraje");
            if (!contadorFinNum) camposFaltantes.push("Contador Final");
            if (!observacionesData) camposFaltantes.push("Observaciones");

            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Error de validación",
                    Message: `Faltan campos obligatorios: ${camposFaltantes.join(", ")}`,
                    CloseCaption: "Cerrar"
                }
            });
        }

        // Validación específica para tipo "Cambio"
        if (tipoData === "Cambio") {
            if (!orden || !Array.isArray(orden) || orden.length === 0 || !orden[0] || !orden[0].BindingObject) {
                return context.executeAction({
                    Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                    Properties: {
                        Title: "Error de validación",
                        Message: "Para tipo 'Cambio' es obligatorio seleccionar una Orden",
                        CloseCaption: "Cerrar"
                    }
                });
            }

            // Extraer datos de orden y reserva solo si el tipo es "Cambio"
            ordenData = orden[0].BindingObject.orden;
            reservaData = orden[0].BindingObject.reserva;
        }

        // Validación de números negativos
        if (kilometrajeNum < 0 || contadorFinNum < 0) {
            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Valor Incorrecto",
                    Message: "No se permiten números negativos en los campos de kilometraje ni contadores.",
                    CloseCaption: "Cerrar"
                }
            });
        }

        // Validar contador inicial
        if (contadorIniNum <= 0) {
            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Aceite No disponible",
                    Message: "El contador inicial es cero. No es posible registrar más consumos de aceite.",
                    CloseCaption: "Cerrar"
                }
            });
        }

        // Validar contadores
        if (contadorFinNum >= contadorIniNum) {
            return context.executeAction({
                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                Properties: {
                    Title: "Error de validación",
                    Message: "El contador inicial debe ser mayor que el contador final",
                    CloseCaption: "Cerrar"
                }
            });
        }

        // Calcular consumo
        let consumo = parseFloat(((contadorIniNum - contadorFinNum) / 4).toFixed(2));
        kilometrajeNum = parseFloat(kilometrajeNum.toFixed(2));
        const filtro = `$filter=planilla_id eq ${id_planilla}`;

        // Validar operario
        return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Empleados', [], `$filter=ficha eq '${operario_diferencial}'`)
            .then((results) => {
                if (!results || results.length === 0) {
                    return context.executeAction({
                        Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                        Properties: {
                            Title: "Ficha no Encontrada",
                            Message: "Número de ficha no encontrada. Debes ingresar un número de ficha válido para continuar",
                            CloseCaption: "Cerrar"
                        }
                    });
                }

                const nombre_op = results.getItem(0).nombre;

                // Buscar posición
                return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro)
                    .then((items) => {
                        let nueva_pos = 1;
                        if (items && items.length > 0) {
                            const posiciones = items.map(item => parseInt(item.pos)).filter(p => !isNaN(p));
                            nueva_pos = Math.max(...posiciones) + 1;
                        }

                        const nuevoItem = {
                            id: guid(context),
                            pos: nueva_pos,
                            planilla_id: id_planilla,
                            equipo_equipo: equipoData,
                            tipo: tipoData,
                            orden_orden: ordenData, // null si no es tipo "Cambio"
                            reserva: reservaData, // null si no es tipo "Cambio"
                            kilometraje: kilometrajeNum,
                            consumo: consumo,
                            op_ficha: operario_diferencialString,
                            op_nombre: nombre_op,
                            contador_ini: contadorIniNum,
                            contador_fin: contadorFinNum,
                            observacion: observacionesData,
                            obs_text: observacionesTxtData
                        };

                        // Crear item
                        return context.executeAction({
                            Name: "/appconsumos_mb/Actions/oData/Create_Items_Planillas_Aceites.action",
                            Properties: {
                                Properties: nuevoItem
                            }
                        }).then(() => {
                            // Construir mensaje de éxito dinámico
                            let mensajeExito = `Item creado exitosamente:\n` +
                                `Equipo: ${equipoData}\n` +
                                `Tipo: ${tipoData}\n`;
                            
                            if (tipoData === "Cambio") {
                                mensajeExito += `Orden: ${ordenData}\n` +
                                               `Reserva: ${reservaData}\n`;
                            }
                            
                            mensajeExito += `Kilometraje: ${kilometrajeNum}\n` +
                                           `Consumo: ${consumo}\n` +
                                           `Contador inicial: ${contadorIniNum}\n` +
                                           `Contador final: ${contadorFinNum}\n` +
                                           `Observación: ${observacionesData}`;

                            // Mostrar mensaje de éxito
                            return context.executeAction({
                                Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                                Properties: {
                                    Title: "Éxito",
                                    Message: mensajeExito,
                                    CloseCaption: "Cerrar"
                                }
                            }).then(() => {
                                // Ocultar formulario y mostrar botón de agregar
                                form_add.setVisible(false);
                                btn_agregar.setVisible(true);
                            });
                        });
                    });
            })
            .catch((error) => {
                return context.executeAction({
                    Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
                    Properties: {
                        Title: "Error",
                        Message: `Error al crear el item: ${error.message || 'Error desconocido'}`,
                        CloseCaption: "Cerrar"
                    }
                });
            });

    } catch (error) {
        return context.executeAction({
            Name: "/appconsumos_mb/Actions/GenericMessageBox.action",
            Properties: {
                Title: "Error",
                Message: `Error inesperado: ${error.message || 'Error desconocido'}`,
                CloseCaption: "Cerrar"
            }
        });
    }
}