/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function get_Now_DateTime_Col(context) {

    let fecha = new Date();

    let dia = fecha.getDate().toString().padStart(2, '0');
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let anio = fecha.getFullYear();

    //let fechaFormateada = `${dia}-${mes}-${anio}`;
    let fechaFormateada = `${anio}-${mes}-${dia}`;

    return fechaFormateada;
}

