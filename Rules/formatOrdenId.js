/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function formatOrdenId(context) {
    let page = context.getPageProxy();
    let titulo = page.getName();
    if (titulo == "Agregar_Solicitud_Campo" || titulo == "Detalle_Solicitudes_Campo" || titulo == "Detalle_Solicitudes_Ingenio") {
        //alert(JSON.stringify(context.binding.orden))
        let valor = context.binding.orden;

        let limpio = valor.replace(/^0+/, '');

        return `Orden: ${limpio}`;
    }

    if (titulo == "Agregar_Solicitud_Ingenio") {
        let clientData = context.evaluateTargetPathForAPI('#Page:Detalle_Orden_Ingenio').getClientData();
        //alert(clientData.context_binding.orden)
        let valor = clientData.context_binding.orden;

        let limpio = valor.replace(/^0+/, '');

        return `Orden: ${limpio}`;
    }


    if (titulo == "Detalle_Orden_Campo" || titulo == "Lista_Ordenes_Campo" || titulo == "Lista_Solicitudes_Campo" || titulo == "Detalle_Orden_Ingenio" || titulo == "Lista_Ordenes_Ingenio" || titulo == "Lista_Solicitudes_Ingenio") {
        let valor = context.binding.orden;
        let limpio = valor.replace(/^0+/, '');

        return limpio;

    }

    if (titulo == "Lista_Historico_Ingenio" || titulo == "Detalle_Historico_Ingenio" || titulo == "Lista_Historico_Campo" || titulo == "Detalle_Historico_Campo") {
        let valor = context.binding.orden_orden;
        let limpio = valor.replace(/^0+/, '');
        return limpio;

    }

    if (titulo == "Revisar_Planilla_Aceite_Motor") {
        let valor = context.binding.orden_orden;
        let limpio = valor ? valor.replace(/^0+/, '') : "";
        return `Orden: ${limpio}`;

    }




}
