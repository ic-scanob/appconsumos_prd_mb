/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function NavTo_List_Historico_Sol_Ingenio(context) {
    let data = context.evaluateTargetPath('#Page:Filtro_Ingenio/#Control:FormCellListPicker_Almacen_O/#Value')[0].BindingObject
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Ingenio').getClientData();
    let clientDataUser = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    clientData.centroH = data.centro
    clientData.almacenH = data.almacen
    clientData.sociedadH = data.sociedad
    clientData.lista_sol_historico_ing = []
    
    let filtro = `$expand=almacen,operario,aprobador,autorizador,equipo,orden&$filter=almacen_sociedad eq '${data.sociedad}' and almacen_almacen eq '${data.almacen}' and almacen_centro eq '${data.centro}' and tipo eq 'INGENIO' &$orderby=fecha_creacion desc`
    let isTecnico = clientDataUser.info_user.rol === 'Técnico'
    if(isTecnico){
        let correo = clientDataUser.info_user.correo
        //filtro += ` and correo_creacion eq ${correo}`
        filtro = `$expand=almacen,operario,aprobador,autorizador,equipo,orden&$filter=almacen_sociedad eq '${data.sociedad}' and almacen_almacen eq '${data.almacen}' and almacen_centro eq '${data.centro}' and tipo eq 'INGENIO' and correo_creacion eq '${correo}' &$orderby=fecha_creacion desc`
    }
    
    clientData.filtroHistorico = filtro;
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
        "Properties": {
            "PageToOpen": "/appconsumos_mb/Pages/Ingenio/Lista_Historico_Ingenio.page"
        }
    });

    
}
