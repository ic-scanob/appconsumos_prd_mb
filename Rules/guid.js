/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function guid(context) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    function generarGUID() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    }

    return generarGUID();
}
