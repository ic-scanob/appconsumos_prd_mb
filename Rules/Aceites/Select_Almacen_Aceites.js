/**
 * Describe this function...
 * @param {IClientAPI} context
 */
import fechaFormateada from '../get_Now_DateTime_Col';
import ayerfecha from '../get_Yest_DateTime_Col';

export default async function Select_Almacen_Aceites(context) {
    const pageProxy = context.getPageProxy();

    const btn_crear = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("btn_crear");
    const btn_registrar = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("btn_registrar");
    const btn_validar = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0").getControl("btn_validar");

    const almacen_aceites = context.evaluateTargetPath('#Page:Filtro_Aceites/#Control:almacen_aceites/#Value');

    // Si no hay nada seleccionado, deshabilita todo y termina
    if (!almacen_aceites || almacen_aceites.length === 0) {
        btn_crear.setEnabled(false);
        btn_registrar.setEnabled(false);
        btn_validar.setEnabled(false);
        return;
    }

    const dataAlmacen = almacen_aceites[0].BindingObject;
    const fechaHoy = fechaFormateada(context);
    const fechaAyer = ayerfecha(context);


    const filtro = `$filter=cast('${fechaHoy}', Edm.Date) eq fecha and almacen_almacen eq '${dataAlmacen.almacen}' and almacen_centro eq '${dataAlmacen.centro}'`;

    const filtroAyerPendiente =
        `$filter=cast('${fechaAyer}', Edm.Date) eq fecha and ` +
        `almacen_almacen eq '${dataAlmacen.almacen}' and ` +
        `almacen_centro eq '${dataAlmacen.centro}' and ` +
        `estado eq 'Pendiente'`;
    // Habilita boton validar por defecto
    //btn_registrar.setEnabled(true);
    btn_validar.setEnabled(true);

    try {


        //Hacer solo si es un técnico

        let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
        let info_user = clientData.info_user

        if (info_user.rol == 'Técnico') {
            // 1) Validar si hay pendientes del día anterior
            const resAyer = await context.read(
                '/appconsumos_mb/Services/app_consumos_prd.service',
                'PlanillasAceites',
                [],
                filtroAyerPendiente
            );

            //alert(JSON.stringify(resAyer))
            //alert( resAyer.length)

            const hayPendientesAyer = resAyer && resAyer.length > 0;

            if (hayPendientesAyer) {
                // Bloquear creación y avisar
                btn_crear.setEnabled(false);
                btn_registrar.setEnabled(true); // opcional: si quieres bloquear todo
                return context.executeAction({
                    "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                    "Properties": {
                        "Title": "Planillas pendientes",
                        "Message": "No puedes crear planillas para hoy hasta enviar todas las planillas del día anterior que están en estado Pendiente.",
                        "OKCaption": "Aceptar"
                    }
                });
                 // No continuamos con la validación de hoy
            }

            // 2) Si no hay pendientes de ayer, aplicar la lógica de hoy
            const results = await context.read(
                '/appconsumos_mb/Services/app_consumos_prd.service',
                'PlanillasAceites',
                [],
                filtro
            );
            
            const tieneDatos = results && results.length > 0;
            //alert(tieneDatos)
            //alert(JSON.stringify(results))
            btn_crear.setEnabled(!tieneDatos);
            btn_registrar.setEnabled(tieneDatos);

        }




    } catch (error) {
        btn_crear.setEnabled(false);
        btn_registrar.setEnabled(false);
        btn_validar.setEnabled(false);
        alert(`Error al leer planillas: ${error.message}`);
    }
}
