/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Yest_DateTime_Col(context) {

    let fecha = new Date();

    // Restar 1 día
    fecha.setDate(fecha.getDate() - 1);

    let dia = fecha.getDate().toString().padStart(2, '0');
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let anio = fecha.getFullYear();

    // Formato YYYY-MM-DD
    let fechaFormateada = `${anio}-${mes}-${dia}`;

    return fechaFormateada;
}

