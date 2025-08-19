/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Target_Lista_Ingenio(context) {
    let target = context.evaluateTargetPath("#Page:Filtro_Ingenio/#ClientData/#Property:lista_ingenio");
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.orden || "").toLowerCase().includes(lowerSearch) ||
                (prod.orden_desc || "").toLowerCase().includes(lowerSearch) ||
                (prod.centro_plan || "").toLowerCase().includes(lowerSearch) ||
                (prod.grupo_plan || "").toLowerCase().includes(lowerSearch) ||
                (prod.equipo || "").toLowerCase().includes(lowerSearch) ||
                (prod.equipo_desc || "").toLowerCase().includes(lowerSearch) ||
                (prod.reserva || "").toLowerCase().includes(lowerSearch) ||
                (prod.sociedad || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;

}
