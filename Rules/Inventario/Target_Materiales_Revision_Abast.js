/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Target_Materiales_Revision_Abast(context) {

    let target = context.evaluateTargetPath("#Page:Detalle_Solicitud_Reabastecimieto/#ClientData/#Property:lista_mat_solicitud_abast");
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.mat_nuevo || "").toLowerCase().includes(lowerSearch) ||
                (prod.mat_nuevo_desc || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;
}
