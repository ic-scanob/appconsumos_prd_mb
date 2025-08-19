/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function getTipoMaterial_Confirmar_Abast(context) {
    var binding = context.binding


    if(typeof binding.mat_nuevo_desc === 'string'){
        return "Nuevo"
    }
    if(typeof binding.material.material_desc === 'string'){
        return "Registrado"
    }
}
