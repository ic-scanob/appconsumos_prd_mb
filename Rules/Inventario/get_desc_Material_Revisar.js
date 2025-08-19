/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_desc_Material_Revisar(context) {
    let mat_nuevo = context.binding.mat_nuevo
    let material = context.binding.material_material

    if(mat_nuevo){
        return context.binding.mat_nuevo_desc
    }

    if(material){
        return context.binding.material.material_desc
    }
}
