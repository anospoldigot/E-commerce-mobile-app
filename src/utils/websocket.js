import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { Notifications } from 'react-native-notifications';

const pusher = Pusher.getInstance();

const websocket = async () => {

    await pusher.init({
        apiKey: "dddeb21050da924580f6",
        cluster: "ap1"
    });

    await pusher.connect();

    await pusher.subscribe({
        channelName: "my-channel",
        onEvent: (event) => {
            console.log(`Event received: ${event}`);

            let localNotification = Notifications.postLocalNotification({
                body: event.data.content,
                title: event.data.subject,
                sound: "chime.aiff",
                silent: false,
                category: "SOME_CATEGORY",
                userInfo: {},
                fireDate: new Date(),
            });
        }
    });


    return pusher;
}


export default websocket;

