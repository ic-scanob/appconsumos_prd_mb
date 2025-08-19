/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Day_Only(context) {
    let fecha = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
    let dateObject = new Date(fecha);
    let day = dateObject.getDate(); // retorna el día del mes como número
    let dayFormatted = day.toString().padStart(2, '0'); // asegura 2 dígitos

    // Guardar el día en clientData
    let clientData = context.evaluateTargetPathForAPI('#Page:Filtro_Aceites').getClientData();
    clientData.aceite_num_planilla = dayFormatted;

    let num_planilla = `N. Planilla ${dayFormatted}`;
    ///alert(clientData.aceite_num_planilla)

    return num_planilla;
}
