/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Target_Lista_Solicitudes_Campo(context) {
    let target = context.evaluateTargetPath("#Page:Filtro_Campo/#ClientData/#Property:lista_sol_campo");
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return prod.orden.toLowerCase().includes(lowerSearch) ||
                prod.or_desc.toLowerCase().includes(lowerSearch) ||
                prod.or_centro_plan.toLowerCase().includes(lowerSearch) ||
                prod.or_grupo_plan.toLowerCase().includes(lowerSearch) ||
                prod.equipo_solicitud.toLowerCase().includes(lowerSearch) ||
                prod.eq_desc_solicitud.toLowerCase().includes(lowerSearch) ||
                prod.reserva.toLowerCase().includes(lowerSearch) ||
                prod.alm_sociedad.toLowerCase().includes(lowerSearch) ||
                prod.estado.toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;
}
