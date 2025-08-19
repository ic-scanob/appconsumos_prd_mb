/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Target_Lista_Historico_Ingenio(context) {
    let target = context.evaluateTargetPath("#Page:Filtro_Ingenio/#ClientData/#Property:filtroHistorico");
    let search = context.searchString;
    let queryBuilder = context.dataQueryBuilder();
    
 
    if (!search) {
        return target;
    } else {
        search = search.toLowerCase();
 
        // Crea condiciones para distintos campos
        let filtrosSearch = [
            `substringof(tolower('${search}'), tolower(orden_orden))`,
            `substringof(tolower('${search}'), tolower(orden/orden_desc))`,
            `substringof(tolower('${search}'), tolower(equipo_equipo))`,
            `substringof(tolower('${search}'), tolower(almacen_almacen))`,
            `substringof(tolower('${search}'), tolower(fecha_creacion))`,
            `substringof(tolower('${search}'), tolower(reserva))`,
            `substringof(tolower('${search}'), tolower(almacen_sociedad))`,
            `substringof(tolower('${search}'), tolower(estado))`,
            `substringof(tolower('${search}'), tolower(equipo/equipo_desc))`
        ];
 
        // Extrae el filtro original del target
        let match = target.match(/\$filter=(.*?)(&|$)/);
        let filtroBase = match ? match[1] : "";
 
        // Combina filtros
        let filtroCombinado = filtroBase ? `(${filtroBase}) and (${filtrosSearch.join(' or ')})` : filtrosSearch.join(' or ');
 
        // Aplica el filtro combinado
        queryBuilder.filter(filtroCombinado);
 
        // Preserva $expand y $orderby del target
        let expandMatch = target.match(/\$expand=([^&]*)/);
        if (expandMatch) queryBuilder.expand(expandMatch[1]);
 
        let orderMatch = target.match(/\$orderby=([^&]*)/);
        if (orderMatch) queryBuilder.orderBy(orderMatch[1]);
 
        return queryBuilder;
    }

    
    /*
    
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.orden.orden || "").toLowerCase().includes(lowerSearch) ||
                (prod.orden.orden_desc || "").toLowerCase().includes(lowerSearch) ||
                (prod.orden.centro_plan || "").toLowerCase().includes(lowerSearch) ||
                (prod.orden.grupo_plan || "").toLowerCase().includes(lowerSearch) ||
                (prod.equipo_equipo || "").toLowerCase().includes(lowerSearch) ||
                (prod.equipo.equipo_desc || "").toLowerCase().includes(lowerSearch) ||
                (prod.reserva || "").toLowerCase().includes(lowerSearch) ||
                (prod.almacen_sociedad || "").toLowerCase().includes(lowerSearch) ||
                (prod.estado || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;
    */
}
