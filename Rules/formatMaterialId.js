/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function formatMaterialId(context) {

    let valor = [context.binding.material, context.binding.material_material, context.binding.mat_nuevo]
        .find(v => typeof v === 'string' && v.trim() !== '');

    let limpio = valor ? valor.replace(/^0+/, '') : '';

    return limpio;



}
