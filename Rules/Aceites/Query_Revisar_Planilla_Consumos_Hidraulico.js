/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Query_Revisar_Planilla_Consumos_Hidraulico(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_hidraulico.id;
    //let filtro = `$expand=equipo&$filter=planilla_id eq ${id_planilla}&$orderby=pos`
    let filtro = `$expand=equipo&$filter=planilla_id eq ${id_planilla}&$orderby=pos`
    return filtro
}
