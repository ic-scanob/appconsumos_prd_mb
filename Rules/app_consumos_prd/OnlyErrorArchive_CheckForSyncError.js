import get_SolicitudesOrdenesAbiertas from '../Campo/get_SolicitudesOrdenesAbiertas';
import get_SolicitudesOrdenesAbiertasIngenio from '../Ingenio/get_SolicitudesOrdenesAbiertasIngenio';

/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function OnlyCheckForSyncError(context) {
    let proxy = context.getPageProxy()
    let caption = proxy.getName()
    //Lista_Solicitudes_Campo
    
    context.count('/appconsumos_mb/Services/app_consumos_prd.service', 'ErrorArchive', '').then(errorCount => {
        if (errorCount > 0) {
            return context.getPageProxy().executeAction('/appconsumos_mb/Actions/ErrorArchive/ErrorArchive_SyncFailure.action').then(function () {
                return Promise.reject(false);
            });
        } else {
            if(caption == "Lista_Solicitudes_Campo"){
                return get_SolicitudesOrdenesAbiertas(context)  
            }      
            
            if(caption == "Lista_Solicitudes_Ingenio"){
                return get_SolicitudesOrdenesAbiertasIngenio(context)
                
            }

            if(caption == "Lista_Solicitudes_Reabastecimiento"){
                //No es necesario redibujar la lista
            }

        }
    });
}