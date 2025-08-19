/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function getCorreo_Admin(context) {
    let correo = context.evaluateTargetPath('#Page:Editar_Usuarios/#Control:correo_user/#Value');
    return correo.toUpperCase()

}
