/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_Now_Datetime(context) {
    //para esta opcion el campo debe ser un String(100)
    //let fechaColombia = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
    let fecha = new Date().toISOString();
    return fecha
}
