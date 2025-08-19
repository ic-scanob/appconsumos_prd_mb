/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Color_Tipo_Material_Revisar(context) {
    let mat_nuevo = context.binding.mat_nuevo
    let material = context.binding.material_material

    if(mat_nuevo){
        return "Indigo"
    }

    if(material){
        return "Grey"
    }
}
