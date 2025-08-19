/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function NavTo_List_Sol_Campo(context) {
    let data = context.evaluateTargetPath('#Page:Filtro_Campo/#Control:almacen_campo/#Value')[0].BindingObject
    let clientDataUser = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Campo').getClientData();
    clientData.centro = data.centro
    clientData.almacen = data.almacen
    clientData.sociedad = data.sociedad
    clientData.lista_sol_campo = []

    let filtro = `$filter=alm_sociedad eq '${data.sociedad}' and alm_almacen eq '${data.almacen}' and alm_centro eq '${data.centro}' and tipo eq 'CAMPO' &$orderby=fecha_creacion desc`

    let isTecnico = clientDataUser.info_user.rol === 'Técnico'
    if(isTecnico){
        let correo = clientDataUser.info_user.correo
        //filtro += ` and correo_creacion eq ${correo}`
        filtro = `$filter=alm_sociedad eq '${data.sociedad}' and alm_almacen eq '${data.almacen}' and alm_centro eq '${data.centro}' and tipo eq 'CAMPO' and correo_creacion eq '${correo}' &$orderby=fecha_creacion desc`
    }

    //+"&$orderby=fecha_creacion desc"
    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'VerSolicitudesAbiertas', [], filtro).then(async (results) => {
        if (results && results.length > 0) {
            clientData.lista_sol_campo = results
           
        }else{
            clientData.lista_campo = []
        }

        context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericNavigation.action",
            "Properties": {
                "PageToOpen": "/appconsumos_mb/Pages/Campo/Lista_Solicitudes_Campo.page"
            }
        });
    }).catch((error) => {
        
        alert(`Error ${error.message}`)
    });

}
