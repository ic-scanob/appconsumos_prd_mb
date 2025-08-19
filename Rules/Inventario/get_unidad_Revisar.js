/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_unidad_Revisar(context) {
    let mat_nuevo = context.binding.mat_nuevo
    let material = context.binding.material_material
    let cantidad_tomada = context.binding.cantidad_tomada

    //Cant. Solicitada: {cantidad_tomada}

    
    if(mat_nuevo){
        return `Cant.Solicitada ${cantidad_tomada} ${context.binding.mat_nuevo_und}`
    }

    if(material){
        return `Cant.Solicitada ${cantidad_tomada} ${context.binding.material.und.und_vz}`
    }

}
