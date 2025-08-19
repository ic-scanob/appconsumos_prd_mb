/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_formConsumosCambio_Hidraulico(context) {
    let cant = context.evaluateTargetPath("#Page:Detalle_Aceite_Hidraulico/#ClientData/#Property:cantCambio");
    if(cant > 0){
        return true
    }

    return false
}
