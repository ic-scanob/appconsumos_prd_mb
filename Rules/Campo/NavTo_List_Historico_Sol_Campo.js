/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_List_Historico_Sol_Campo(context) {
    let data = context.evaluateTargetPath('#Page:Filtro_Campo/#Control:almacen_campo/#Value')[0].BindingObject
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Campo').getClientData();
    let clientDataUser = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    clientData.centroH = data.centro
    clientData.almacenH = data.almacen
    clientData.sociedadH = data.sociedad
    clientData.lista_sol_historico_campo = []
    
    let filtro = `$expand=almacen,operario,aprobador,autorizador,equipo,orden&$filter=almacen_sociedad eq '${data.sociedad}' and almacen_almacen eq '${data.almacen}' and almacen_centro eq '${data.centro}' and tipo eq 'CAMPO' &$orderby=fecha_creacion desc`
    
    let isTecnico = clientDataUser.info_user.rol === 'Técnico'
    if(isTecnico){
        let correo = clientDataUser.info_user.correo
        //filtro += ` and correo_creacion eq ${correo}`
        filtro = `$expand=almacen,operario,aprobador,autorizador,equipo,orden&$filter=almacen_sociedad eq '${data.sociedad}' and almacen_almacen eq '${data.almacen}' and almacen_centro eq '${data.centro}' and tipo eq 'CAMPO' and correo_creacion eq '${correo}' &$orderby=fecha_creacion desc`
    }
    
    clientData.filtroHistoricoCampo = filtro;
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Campo/Lista_Historico_Campo.page"
        }
    });
}
