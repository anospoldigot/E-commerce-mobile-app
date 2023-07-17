import NotifService from "../../NotifService"



const onRegister = (token) => { 
    setRegisterToken(token.token)
    setFcmRegistered(true)
}

const onNotif = (notif) => {
    Alert.alert(notif.title, notif.message);
}

const handlePerm = (perms) => {
    Alert.alert('Permissions', JSON.stringify(perms));
}

export default new NotifService(onRegister, onNotif)