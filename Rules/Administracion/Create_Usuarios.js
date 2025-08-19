/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default async function Create_Usuarios(context) {
    let lista_empleados = context.evaluateTargetPath('#Page:Agregar_Usuarios/#Control:ListaEmpleados/#Value');
    let rol = context.evaluateTargetPath('#Page:Agregar_Usuarios/#Control:rol/#Value');
    let isadmin = context.evaluateTargetPath('#Page:Agregar_Usuarios/#Control:isadmin/#Value');
    let repetidos = "";
    let errores = [];
    let exitosos = [];

    if (lista_empleados.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar al menos un empleado de la lista para continuar`
            }
        });
    }

    if (!rol || rol.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Alerta",
                "Message": `Debes seleccionar un rol para los usuarios`
            }
        });
    }

    let rol_value = rol[0].ReturnValue;
    
    let promises = lista_empleados.map((empleado, i) => {
        let nuevo_empleado = empleado.BindingObject;

        return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'EmpleadosApp', [], `$filter=ficha eq '${nuevo_empleado.ficha}'`)
            .then(result => {
                if (result.length === 0) {
                    return context.executeAction({
                        "Name": "/appconsumos_mb/Actions/oData/Create_EmpleadosApp.action",
                        "Properties": {
                            "Properties": {
                                "ficha": nuevo_empleado.ficha,
                                "nombre": nuevo_empleado.nombre,
                                "correo": nuevo_empleado.correo,
                                "rol": rol_value,
                                "isAdmin":isadmin,
                                "cargo": nuevo_empleado.cargo,
                                "sociedad": nuevo_empleado.sociedad,
                                "sapUsr": nuevo_empleado.sapUsr
                            }
                        }
                    }).then(() => {
                        exitosos.push(`${nuevo_empleado.nombre} (${nuevo_empleado.ficha})`);
                    }).catch(() => {
                        errores.push(`${nuevo_empleado.nombre} (${nuevo_empleado.ficha})`);
                    });
                }
                repetidos += `${nuevo_empleado.nombre} (${nuevo_empleado.ficha}), `;
                return Promise.resolve();
            }).catch(() => {
                errores.push(`${nuevo_empleado.nombre} (${nuevo_empleado.ficha})`);
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
                    "Message": `Se encontraron usuarios ya creados: ${repetidos}`
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
                        "Message": `Falló la creación de los usuarios.`
                    }
                });
            } else if (errores.length > 0 && exitosos.length > 0) {
                // Algunos fallaron, otros no
                mensajePromise = context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Alerta parcial",
                        "Message": `Algunos usuarios fueron creados exitosamente.\n\nUsuarios con error:\n${errores.join('\n')}`
                    }
                });
            } else {
                // Todo fue exitoso
                mensajePromise = context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Creación exitosa",
                        "Message": `Se finalizó el proceso de creación exitosamente`
                    }
                });
            }

            // Finalmente, después de mostrar el mensaje final, cerramos la ventana
            mensajePromise.then(() => {
                context.executeAction({
                    "Name": "/appconsumos_mb/Actions/CloseModalPage_Complete.action",
                    "NavigateBackToPage": "/appconsumos_mb/Pages/Administracion/Lista_Usuarios.page"
                });
            });
        });
    });


    //[0].ReturnValue
    //(lista_empleados[0].BindingObject)
    //alert(JSON.stringify(context.evaluateTargetPath("#Page:Agregar_Usuarios/#Control:ListaEmpleados/#Value/#Index:1/BindingObject/cargo")))

}
