/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Target_Lista_CampoEquipo(context) {

    let target = context.evaluateTargetPath("#Page:Filtro_Campo/#ClientData/#Property:lista_campo_equipos");

    let searchString = context.searchString;

    if (searchString) {
        let searchResult = target.filter(prod => { 
            return prod.equipo.includes(searchString) ||
                   prod.centro_plan.includes(searchString) ||
                   prod.equipo_desc.includes(searchString) ||
                   prod.tipo.includes(searchString) ||
                   prod.sociedad.includes(searchString)
        });
        target = searchResult;
    }
    return target;
}
