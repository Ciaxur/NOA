import { createSocket } from 'dgram';
import { MessageData } from '../Interfaces/MessageData';


// Construct Message Data Object
const message: MessageData = {
    UID: "au3209",
    message: "Hello world!",
    status: "Online",
    username: "Big Billy"
};


// DEBUG :: Construct message and send
const packet = Buffer.from(JSON.stringify(message));
const client = createSocket('udp4');

client.send(packet, 41234, 'localhost', err => {
    if (err) { console.log(`Error occurred while sending message: \n${err.stack}`); }
    else { console.log("Message sent successfully"); }

    client.close();
});