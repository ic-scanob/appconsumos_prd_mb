/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Filtro_Material_Almacenes(context) {
    let target = context.evaluateTargetPath('#Page:Filtro_Almacen_Inventario/#ClientData/#Property:lista_inv');
    let searchString = context.searchString;

    if (searchString) {
        let lowerSearch = searchString.toLowerCase();

        let searchResult = target.filter(prod => {
            return (prod.Txtmd || "").toLowerCase().includes(lowerSearch) ||
                (prod.Matnr || "").toLowerCase().includes(lowerSearch);
        });

        target = searchResult;
    }

    return target;
}
