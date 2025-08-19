/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Cerrar_Planilla_Aceite_Motor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_motor.id;
    let filtro = `$filter=id eq ${id_planilla}`;
    let pageProxy = context.getPageProxy();
    //acceder al keyvalue section
    var keyvalueSection = pageProxy.getControl("SectionedTable0").getSection("SectionKeyValue0")
   
    var btn_agregar = pageProxy.getControl("SectionedTable0").getSection("SectionButtonTable0")
    var form_add = pageProxy.getControl("SectionedTable0").getSection("SectionFormCell0")

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'PlanillasAceites', [], filtro).then(async (results) => {
        if (results && results.length > 0) {
            
            clientData.data_planilla_motor.total = results.getItem(0).total;
            clientData.data_planilla_motor.contador_fin = results.getItem(0).contador_fin;
            clientData.data_planilla_motor.estado = results.getItem(0).estado;

            btn_agregar.setVisible(false)
            form_add.setVisible(false)
            keyvalueSection.redraw();
            pageProxy.redraw();

        } else {
            return context.executeAction({
                "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
                "Properties": {
                    "Title": "Sin datos",
                    "Message": "No se encontró la planilla",
                    "OKCaption": "Aceptar"
                }
            });
        }
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
