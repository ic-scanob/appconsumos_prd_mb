/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function getTipoColorMaterial_Confirmar_Abast(context) {
    var binding = context.binding

    if(typeof binding.mat_nuevo_desc === 'string'){
        return "Indigo"
    }
    if(typeof binding.material.material_desc === 'string'){
        return "Grey"
    }
}
