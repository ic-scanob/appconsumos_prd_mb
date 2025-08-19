/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Target_Revisar_Planilla_Aceite_Reductor(context) {
    let target = context.evaluateTargetPath("#Page:Detalle_Aceite_Reductor/#ClientData/#Property:lista_revision_reductor");
    let searchString = context.searchString;
    
    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.pos || "").toLowerCase().includes(lowerSearch) ||
                (prod.planilla || "").toLowerCase().includes(lowerSearch) ||
                (prod.tipo || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    target = target.sort((a, b) => {
        const posA = parseInt(a.pos, 10);
        const posB = parseInt(b.pos, 10);
    
        if (isNaN(posA)) return 1;
        if (isNaN(posB)) return -1;
        return posA - posB;
    });
    return target;
}
