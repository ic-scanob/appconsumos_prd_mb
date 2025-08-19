/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_Contador_Inicial_Reductor(context) {
    const pageProxy = context.getPageProxy();
    var form_add = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")
    var cont_inicial_reductor = form_add.getControl("cont_inicial_reductor")
    var btn_agregar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
    //obtener los controlasdores del formulario
    let equipo = form_add.getControl("equipo_reductor")
    let tipo = form_add.getControl("tipo_reductor")
    let kmh = form_add.getControl("kmh_reductor")
    let operario_reductor = form_add.getControl("operario_reductor")
    let cont_final = form_add.getControl("con_final_reductor")
    let observaciones = form_add.getControl("observaciones_reductor")
    let orden_reductor = form_add.getControl("orden_reductor")

    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_reductor.id;
    let cantidad_ini;

    const filtro = `$filter=planilla_id eq ${id_planilla}`;

    if (!clientData.esHoy) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Acción No Permitida",
                "Message": `No es posible registrar consumos. Esta planilla corresponde al día de ayer. Por favor, envie la planilla.`,
                "OKCaption": "Cerrar"
            }
        });
    }
    //Leer los datos de items planilla
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro).then(async (results) => {
        //si hay items en la planilla
        if (results && results.length > 0) {
            //alert("ya hay items en la planilla");

            // Trabajar directamente con el array results
            // Encontrar el item con la posición más alta
            let ultimoItem = null;
            let maxPos = -1;

            results.forEach(item => {
                const pos = parseInt(item.pos);
                if (!isNaN(pos) && pos > maxPos) {
                    maxPos = pos;
                    ultimoItem = item;
                }
            });

            // Validar que tenga el campo 'contador_fin'
            if (ultimoItem && ultimoItem.contador_fin !== undefined && ultimoItem.contador_fin !== null) {
                cantidad_ini = ultimoItem.contador_fin;
            } else {
                cantidad_ini = clientData.data_planilla_reductor.contador_ini;
            }

        } else {

            //alert(id_planilla);
            cantidad_ini = clientData.data_planilla_reductor.contador_ini;
        }

        form_add.setVisible(true);

        var cant_inicial_planilla = cantidad_ini;
        //alert(cant_inicial_planilla)
        cont_inicial_reductor.setValue(cant_inicial_planilla);
        //----
        equipo.setValue("");
        tipo.setValue("");
        observaciones.setValue("");
        kmh.setValue("");
        operario_reductor.setValue("");
        cont_final.setValue("");
        orden_reductor.setValue("");
        //----
        orden_reductor.setVisible(false)
        btn_agregar.setVisible(false)
        

    })
        .catch((error) => {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Error",
                    "Message": `Error al consultar datos: ${error.message}`,
                    "OKCaption": "Cerrar"
                }
            });
        });
}
