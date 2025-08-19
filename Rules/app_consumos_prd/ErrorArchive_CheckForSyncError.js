import get_Info_Usuario from '../get_Info_Usuario';
/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function CheckForSyncError(context) {
        context.count('/appconsumos_mb/Services/app_consumos_prd.service', 'ErrorArchive', '').then(errorCount => {
        if (errorCount > 0) {
            return context.getPageProxy().executeAction('/appconsumos_mb/Actions/ErrorArchive/ErrorArchive_SyncFailure.action').then(function() {
                return Promise.reject(false);
            });
        }else {
            return get_Info_Usuario(context)
        }
    });
}