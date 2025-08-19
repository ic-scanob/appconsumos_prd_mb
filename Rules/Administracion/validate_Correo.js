/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function validate_Correo(context) {
    let correo = context.evaluateTargetPath('#Page:Editar_Usuarios/#Control:correo_user/#Value');
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        return false
        
    }else{
        return true
    }
}
