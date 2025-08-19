/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function getMaterialDesc_Confirmar_Abast(context) {
    var binding = context.binding

    if(typeof binding.mat_nuevo_desc === 'string'){
        return binding.mat_nuevo_desc
    }
    if(typeof binding.material.material_desc === 'string'){
        return binding.material.material_desc
    }

}
