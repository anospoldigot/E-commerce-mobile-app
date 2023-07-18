import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { Notifications } from 'react-native-notifications';
import { BASE_URL } from '../store/url';
import api from './api';
import axios from 'axios';
import { AuthStore } from '../store/auth';

const pusher = Pusher.getInstance();


const onConnectionStateChange = (
    currentState,
    previousState
) => {
    console.log(
        `onConnectionStateChange. previousState=${previousState} newState=${currentState}`
    );
};

const onError = (message, code, error) => {
    console.log(`onError: ${message} code: ${code} exception: ${error}`);
};

const onEvent = (event) => {
    console.log(`onEvent: ${event}`);
};

const onSubscriptionSucceeded = (channelName, data) => {
    console.log(
        `onSubscriptionSucceeded: ${channelName} data: ${JSON.stringify(data)}`
    );
    const channel = pusher.getChannel(channelName);
    const me = channel.me;
    // onChangeMembers([...channel.members.values()]);
    console.log(`Me: ${me}`);
};

const onSubscriptionCount = (
    channelName,
    subscriptionCount
) => {
    console.log(
        `onSubscriptionCount: ${subscriptionCount}, channelName: ${channelName}`
    );
};

const onSubscriptionError = (
    channelName,
    message,
    e
) => {
    console.log(`onSubscriptionError: ${message}, channelName: ${channelName} e: ${e}`);
};

const onDecryptionFailure = (eventName, reason) => {
    console.log(`onDecryptionFailure: ${eventName} reason: ${reason}`);
};

const onMemberAdded = (channelName, member) => {
    console.log(`onMemberAdded: ${channelName} user: ${member}`);
    const channel = pusher.getChannel(channelName);
    onChangeMembers([...channel.members.values()]);
};

const onMemberRemoved = (channelName, member) => {
    console.log(`onMemberRemoved: ${channelName} user: ${member}`);
    const channel = pusher.getChannel(channelName);
    onChangeMembers([...channel.members.values()]);
};

// See https://pusher.com/docs/channels/library_auth_reference/auth-signatures/ for the format of this object.
const onAuthorizer = async (channelName, socketId) => {
    try {
        console.log(
            `calling onAuthorizer. channelName=${channelName}, socketId=${socketId}`
        );

        const token = AuthStore.state.token; // Ambil token akses dari penyimpanan lokal atau state aplikasi
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }

        const response = await axios.post(BASE_URL + 'broadcasting/auth', {
            socket_id: socketId,
            channel_name: channelName,
        });

        return response.data;

    } catch (error) {
        console.error(`response`, error);
    }
};


export const pusherCredential = {
    apiKey: "dddeb21050da924580f6",
    cluster: "ap1",
    authEndpoint: BASE_URL + 'broadcasting/auth',
    onAuthorizer,
    onConnectionStateChange,
    onError,
    onEvent,
    onSubscriptionSucceeded,
    onSubscriptionError,
    onSubscriptionCount,
    onDecryptionFailure,
    onMemberAdded,
    onMemberRemoved,
};


const websocket = async (isAuthenticated, user, notification) => {

    console.log('DEFAULT SUBS SUCCESS');

    if (isAuthenticated) {
        await pusher.init(pusherCredential);
        await pusher.connect();
        await pusher.subscribe({
            channelName: "private-App.Models.User.3",
            onEvent: (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                notification({
                    title: data.subject,
                    message: data.content
                });
            }
        });
    }


    return pusher;
}


export default websocket;

