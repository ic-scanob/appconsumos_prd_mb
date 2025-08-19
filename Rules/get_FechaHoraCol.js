/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function get_FechaHoraCol(context) {

    let fechaUTC = new Date();

    // Ajustar a hora de Colombia (UTC-5)
    let offsetColombia = -5 * 60; // en minutos
    fechaUTC.setMinutes(fechaUTC.getMinutes() + offsetColombia + fechaUTC.getTimezoneOffset());

    let dia = fechaUTC.getDate().toString().padStart(2, '0');
    let mes = (fechaUTC.getMonth() + 1).toString().padStart(2, '0');
    let anio = fechaUTC.getFullYear();

    let horas = fechaUTC.getHours();
    let minutos = fechaUTC.getMinutes().toString().padStart(2, '0');
    let segundos = fechaUTC.getSeconds().toString().padStart(2, '0');

    let ampm = horas >= 12 ? 'p. m.' : 'a. m.';
    horas = horas % 12;
    horas = horas === 0 ? 12 : horas; // el 0 en formato 12h es 12

    let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos}:${segundos} ${ampm}`;
    let fechaFormateada = `${dia}-${mes}-${anio} ${horaFormateada}`;

    return fechaFormateada;
}
