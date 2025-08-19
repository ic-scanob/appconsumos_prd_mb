/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Target_Lista_Materiales(context) {

    let target = context.evaluateTargetPath("#Page:Detalle_Orden_Campo/#ClientData/#Property:lista_materiales");
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.material || "").toLowerCase().includes(lowerSearch) ||
                (prod.material_desc || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;

}
