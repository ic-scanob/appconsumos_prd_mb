/**
 * Describe this function...
 * @param {context} clientAPI
 */
export default function Create_Almacenes(context) {

    let lista_almacenes = context.evaluateTargetPath('#Page:Agregar_Almacenes/#Control:FormCellListPicker_Almacenes/#Value');
    let tipo_almacen = context.evaluateTargetPath('#Page:Agregar_Almacenes/#Control:FormCellListPicker_Tipo/#Value');
    let repetidos = "";
    let errores = [];
    let exitosos = [];

    if (lista_almacenes.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar al menos un almacén de la lista para continuar.`
            }
        });
    }

    if (!tipo_almacen || tipo_almacen < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar un tipo de almacen.`
            }
        });
    }

    let tipoalmacen_value = tipo_almacen[0].ReturnValue;

    let promises = lista_almacenes.map((almacen, i) => {
        let nuevo_almacen = almacen.BindingObject;

        return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'AlmacenesApp', [], `$filter=almacen eq '${nuevo_almacen.almacen}' and centro eq '${nuevo_almacen.centro}' and sociedad eq '${nuevo_almacen.sociedad}'`)
            .then(result => {
                if (result.length === 0) {
                    return context.executeAction({
                        "Name": "/appconsumos_mb/Actions/oData/Create_AlmacenesApp.action",
                        "Properties": {
                            "Properties": {
                                "sociedad": nuevo_almacen.sociedad,
                                "almacen": nuevo_almacen.almacen,
                               "centro": nuevo_almacen.centro,
                                "almacen_desc": nuevo_almacen.almacen_desc,
                                "tipo": tipoalmacen_value,
                            }
                        }
                    }).then(() => {
                        exitosos.push(`${nuevo_almacen.almacen} (${nuevo_almacen.almacen_desc})`);
                    }).catch(() => {
                        errores.push(`${nuevo_almacen.almacen} (${nuevo_almacen.almacen_desc})`);
                    });
                }
                repetidos += `${nuevo_almacen.almacen} (${nuevo_almacen.almacen_desc}), `;
                return Promise.resolve();
            }).catch(() => {
                errores.push(`${nuevo_almacen.almacen} (${nuevo_almacen.almacen_desc})`);
            });
    });

    Promise.allSettled(promises).then(() => {

        // Primero mostramos repetidos (si existen)
        let repetidosPromise = Promise.resolve();
        if (repetidos.length > 0) {
            repetidosPromise = context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Repetidos",
                    "Message": `Se encontraron almacenes ya creados: ${repetidos}`
                }
            });
        }

        // Después de mostrar repetidos mostramos los otros mensajes
        repetidosPromise.then(() => {
            let mensajePromise;

            if (errores.length > 0 && exitosos.length === 0) {
                // Si todo falló
                mensajePromise = context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Error",
                        "Message": `Falló la creación de los almacenes.`
                    }
                });
            } else if (errores.length > 0 && exitosos.length > 0) {
                // Algunos fallaron, otros no
                mensajePromise = context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Alerta parcial",
                        "Message": `Algunos almacenes fueron creados exitosamente.\n\nAlmacenes con error:\n${errores.join('\n')}`
                    }
                });
            } else {
                // Todo fue exitoso
                mensajePromise = context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Creación exitosa",
                        "Message": `Los Almacenes fueron creados exitosamente`
                    }
                });
            }

            // Finalmente, después de mostrar el mensaje final, cerramos la ventana
            mensajePromise.then(() => {
                context.executeAction({
                    "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                    "NavigateBackToPage": "/appconsumos_mb/Pages/Administracion/Lista_Almacenes.page"
                });
            });
        });
    });


}
