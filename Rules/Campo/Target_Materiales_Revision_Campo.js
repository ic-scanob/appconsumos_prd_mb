/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Target_Materiales_Revision_Campo(context) {
    let target = context.evaluateTargetPath("#Page:Detalle_Solicitudes_Campo/#ClientData/#Property:lista_mat_solicitud_campo");
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.material_material || "").toLowerCase().includes(lowerSearch) ||
                (prod.material.material_desc || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;
}
