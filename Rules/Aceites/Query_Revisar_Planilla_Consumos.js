/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Query_Revisar_Planilla_Consumos(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_motor.id;
    //let filtro = `$expand=equipo&$filter=planilla_id eq ${id_planilla}&$orderby=pos`
    let filtro = `$expand=equipo&$filter=planilla_id eq ${id_planilla}&$orderby=pos`
    return filtro
}
