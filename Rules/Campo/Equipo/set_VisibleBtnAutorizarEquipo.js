/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function set_VisibleBtnAprobarEquipo(context) {
    var object = context.binding
    var estado = object.estado
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;
    let reserva = object.reserva;

    // Consumo por equipo: nunca tiene reserva
    return estado === 'Aprobado' && info.rol === 'Autorizador' && !reserva;

}