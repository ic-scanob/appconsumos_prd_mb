/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_formConsumosCambio_Servotransmisor(context) {
    let cant = context.evaluateTargetPath("#Page:Detalle_Aceite_Servotransmisor/#ClientData/#Property:cantCambio");
    if(cant > 0){
        return true
    }

    return false
}
