/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_ConfirmacionTec(context) {
    var object = context.binding
    var confirmacion_tec = object.confirmacion_tec
    if(!confirmacion_tec || confirmacion_tec === false){
        return 'Entregado: No'
    }

    return 'Entregado: Si';
}
