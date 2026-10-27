/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_List_Campo_EquipoEquipo(context) {
    const pageProxy = context.getPageProxy();
    let equipos = context.evaluateTargetPath('#Page:Lista_Equipos_Campo/#Control:filtro_equipos/#Value');
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Campo').getClientData();
    var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0")

    if (equipos.length < 1) {
        clientData.lista_campo_equipos = []
        return list_component.redraw()
    }

    let filtro = '$filter='

    equipos.forEach(e => {
        filtro += `equipo eq '${e.BindingObject.equipo}' or `      
    });

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'Equipos', [], filtro.slice(0, -4)).then(async (results) => {
        if (results && results.length > 0) {
            clientData.lista_campo_equipos = results
            list_component.redraw()
        }else{
            clientData.lista_campo_equipos = []
            list_component.redraw()
        }
    })

}
