/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function Response_firmarPDF(context) {
    let actionResult = context.getActionResult("Call_FirmarPDF2")
    alert("1")
    //let data = JSON.parse(actionResult.data)
    //alert(JSON.stringify(data))
    //alert("2")
    //alert(JSON.stringify(context.data))
}
