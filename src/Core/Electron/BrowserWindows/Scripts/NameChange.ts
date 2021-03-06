import * as $ from 'jquery';
import { ipcRenderer } from 'electron';

// Initiate EventListener for Button Click
$('button').click(e => {
    changeName();
});

// Initiate EventListener for ENTER Button Click
$('#usernameInput').keyup(e => {
    // ENTER Key Clicked
    if (e.keyCode === 13) {
        changeName();
    }
});


// Change Username
function changeName() {
    // Get the Username
    const str = $('#usernameInput').val() as string;

    // Send Message to IPCmain
    ipcRenderer.send('async-ChangeName', str);
}