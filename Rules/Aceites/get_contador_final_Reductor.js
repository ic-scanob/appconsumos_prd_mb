/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_contador_final_Reductor(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_reductor.id;
    const filtro = `$filter=planilla_id eq ${id_planilla}`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro)
        .then((items) => {
            if (items && items.length > 0) {
                // Buscar el ítem con la posición más alta
                const itemConPosMaxima = items.reduce((maxItem, currentItem) => {
                    const posActual = parseInt(currentItem.pos);
                    const posMax = parseInt(maxItem.pos);
                    return (!isNaN(posActual) && posActual > posMax) ? currentItem : maxItem;
                }, items[0]);

                // Obtener y devolver contador_fin como decimal
                const contadorFin = parseFloat(itemConPosMaxima.contador_fin);
                return isNaN(contadorFin) ? 0 : contadorFin;
            }else{
                let contador_inicial =  clientData.data_planilla_reductor.contador_ini;
                return contador_inicial
            }
            
        })
        .catch((error) => {
            console.error('Error al obtener el contador final:', error);
            return 0;
        });
}
