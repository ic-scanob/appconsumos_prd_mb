/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_tag_Material_Revisar(context) {

    let mat_nuevo = context.binding.mat_nuevo
    let material = context.binding.material_material

    if(mat_nuevo){
        return 'Nuevo'
    }

    if(material){
        return 'Registrado'
    }
}
