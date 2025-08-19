/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Target_Lista_Materiales(context) {
    let target = context.evaluateTargetPath("#Page:Detalle_Orden_Ingenio/#ClientData/#Property:lista_materiales");
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.Matnr || "").toLowerCase().includes(lowerSearch) ||
                (prod.Txtmd || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;

}
