/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Detalle_Planilla_Motor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    //let clientDataFiltro = context.evaluateTargetPathForAPI('#Page:Filtro_Fecha_Aceite').getClientData();

    //let fecha = clientDataFiltro.fecha;
    let id_planilla = clientData.data_planilla_motor.id;

    let filtro = `$expand=almacen,operario&$filter=id eq ${id_planilla}`;
    return filtro
}
