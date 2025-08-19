/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Total_Consumos_Diferencial(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    let id_planilla = clientData.data_planilla_diferencial.id;
    const filtro = `$filter=planilla_id eq ${id_planilla}`;

    return context.read('/appconsumos_mb/Services/app_consumos_prd.service', 'ItemPlanillasAceites', [], filtro)
        .then((items) => {
            if (items && items.length > 0) {
                // Convertir cada consumo a número (float) y sumar
                const total = items
                    .map(item => parseFloat(item.consumo))
                    .filter(c => !isNaN(c))
                    .reduce((acc, val) => acc + val, 0);

                return total.toFixed(2); 
            }
            return 0;
        })
        .catch((error) => {
            alert(error)
            return 0;
        });
}
