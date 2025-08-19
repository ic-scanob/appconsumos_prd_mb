/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function setVisible_Aceite_IC(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:Main').getClientData();
    let info = clientData.info_user;

    if (info.sociedad ==='AI01'){
        return true;

    }else if(info.sociedad ==='AI08'){
        return false;
    }else{
        alert("no hay sociedad")
    }


}
