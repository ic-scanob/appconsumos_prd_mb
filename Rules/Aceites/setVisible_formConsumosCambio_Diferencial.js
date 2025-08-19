/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_formConsumosCambio_Diferencial(context) {
    let cant = context.evaluateTargetPath("#Page:Detalle_Aceite_Diferencial/#ClientData/#Property:cantCambio");
    if(cant > 0){
        return true
    }

    return false
}
