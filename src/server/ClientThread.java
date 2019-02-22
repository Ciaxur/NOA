package server;

import client.MessagePacket;

import java.io.*;
import java.net.Socket;
import java.net.SocketException;

/*
 * This class is associated with one client, and recieves messages to be send to the other clients.
 * When the user disconnects from the server this class throws an error and then properly closes the
 * client by notifying the other clients that this client is disconnecting and then removes this client
 * from the user and client lists
 */

public class ClientThread extends Thread {

    // Connection/Server Data
    private Socket socket;
    private MessagePacket msgPack = null;
    private ObjectOutputStream output = null;
    private ObjectInputStream input = null;

    // Client Data
    private int id;
    private String username;


    /**
     * Constructor that sets up Connection and Client initial Data
     *
     * @param socket - Server accepted Socket Connection
     * @param id - Client's Assigned ID
     */
    public ClientThread(Socket socket, int id){
        this.socket = socket;
        this.id = id;
    }

    /** @return Current Client's ID */
    public int getClientID() { return id; }

    /** @return Current Client's UserName */
    public String getUsername() { return username; }

    /**
     * Thread Overloaded 'run' Method
     *  Initiate Client-Server Connection
     *  Handle Message Packets and Input/Output Streams
     *  Handle User Connect/Disconnect
     */
    public void run(){
        // Start Client-Server Connection
        try {
            // Setup Streams
            output = new ObjectOutputStream(socket.getOutputStream());

            // While loop to receive all the Output Streams from Clients
            while(true) {
                // Re-initiate OutputStream to get all Output Streams from Clients
                input = new ObjectInputStream(socket.getInputStream());

                // Convert Input Stream Object Received into a MessagePacket Object
                msgPack = (MessagePacket) input.readObject();

                // Check if a User has Connected
                // Get that User's Name and update chat list
                if(msgPack.getContentsData() == null){
                    msgPack.setConnectingStatus(true);
                    username = msgPack.getUsername();
                    ServerMain.addUserToList(username);
                    msgPack.setChatList(ServerMain.getUsersList());
                }

                // Send Message from current UserThread to all the Users in
                //  the clientList
                for (ClientThread ct : ServerMain.getClientList()) {
                    // Make sure there is Content to Send
                    // Make sure not to send MessagePack to self
                    if (this.id != ct.id) {
                        ct.output.writeObject(msgPack);
                        ct.output.flush();
                    }

                    // If there is no Content in the MessagePack Object received...
                    else if(msgPack.getContentsData() == null) {
                        msgPack.setUsername("You");
                        ct.output.writeObject(msgPack);
                        ct.output.flush();
                        msgPack.setUsername(username);
                    }
                }

                // Reset Output Stream
                output.reset();
            }
        }

        // Handle Connection Exceptions
        catch (SocketException se) {
            se.printStackTrace();
        }
        catch (IOException e){
            e.printStackTrace();
        }
        catch (ClassNotFoundException e1) {
            e1.printStackTrace();
        }

        // Terminate ClientThread
        finally {
            closeClient();
        }
    }

    /** Terminate Client Properly closing connections and updating server list */
    private void closeClient() {
        // Close up sockets, streams, and update list
        try {
            socket.close();
            input.close();
            output.close();
            ServerMain.removeFromList(id);

        }

        // Handle Exceptions
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Notify Current ClientThread that a User has disconnected
     *  This method is mainly used by the Server
     *
     * @param packet - Message Packet instance with User Disconnected Data
     */
    public void sendDisconnectUpdate(MessagePacket packet){
        // Write the MessagePacket to the Output Stream
        // ClientThread will handle this msgPacket in the 'run' method
        //  using the Output Stream
        try {
            output.writeObject(packet);
        } catch (IOException e){
            e.printStackTrace();
        }
    }
}

