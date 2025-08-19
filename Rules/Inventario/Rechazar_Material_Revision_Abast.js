/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Rechazar_Material_Revision_Abast(context) {

    const pageProxy = context.getPageProxy();
    let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Solicitud_Reabastecimieto').getClientData();
    //clientData.lista_mat_solicitud_abast

    //let material = context.evaluateTargetPath('#Page:Revision_Solicitud_Ingenio/#Control:FormCellListPicker_Materiales/#Value');

    let clientDataMaterial = context.evaluateTargetPathForAPI('#Page:Revision_Solicitud_Reabastecimiento').getClientData();
    let data = clientDataMaterial.infoMaterial

    //var list_component = pageProxy.getControl("SectionedTable0").getSection("SectionObjectTable0");

    //let data = material[0].BindingObject

    /*
    if (material.length < 1) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `Debes seleccionar un material para continuar`
            }
        });
    }*/


    //var material = data.mat_nuevo || data.material_material || '';
    
    let material = [data.mat_nuevo, data.material_material].find(v => typeof v === 'string' && v.trim() !== '');

    let material_desc = [data.mat_nuevo_desc, data.material?.material_desc]
        .find(v => typeof v === 'string' && v.trim() !== '');

    let tipo = data.mat_nuevo ? 'Nuevo' : 'Registrado';
    
    var nuevo = {
        id: data.id,
        material: material,
        material_desc: material_desc,
        cant_sol: data.cantidad_tomada,
        cant_apro: 0,
        almacen: null,
        aprobado: 'Rechazado',
        tipo: tipo
    }
    nuevo["@odata.readLink"] = data["@odata.readLink"]
    const duplicado = clientData.lista_mat_solicitud_abast.filter(m => m.material === nuevo.material).length > 0

    //const duplicado = clientData.lista_mat_solicitud_abast.filter(m => m.mat_nuevo === data.mat_nuevo && m.almacen_almacen === data.almacen_almacen).length > 0
    if (duplicado) {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/GenericMessageBox.action",
            "Properties": {
                "Title": "Material no Agregado",
                "Message": `El material ya fue agregado anteriormente`
            }
        });
    }


    clientData.lista_mat_solicitud_abast.push(nuevo);

    //list_component.redraw()
    return context.executeAction({
        "Name": "/appconsumos_mb/Actions/GenericToastMessage.action",
        "Properties": {
            "Message": `Material Rechazado`,
            "Duration": 1,
            "ShowActivityIndicator": true,
        }
    }).then(() => {
        return context.executeAction({
            "Name": "/appconsumos_mb/Actions/ClosePage.action",
            "NavigateBackToPage": "/appconsumos_mb/Pages/Inventario/Revision_Solicitud_Reabastecimiento.page"
        });
    });;
}
