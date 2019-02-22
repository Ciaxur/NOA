package server;

import client.MessagePacket;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

/*
 * Main class for the server package, this class listens for new clients to be connected then creates
 * a new object of ClientThread and places that new object into an array list of clients to be used
 * to call upon to send messages to other clients.
 * This class also contains the functions responsible for readjusting the client and users list
 * when a user disconnects as well as the function to alert other clients of a users leaving to update
 * the users list and supply a notification on the main chat window
 */

public class ServerMain {

    // List of all running ClientThread Instances
    // List of all User Names
    private static ArrayList<ClientThread> clientList = new ArrayList<>();
    private static ArrayList<String> usersList = new ArrayList<>();

    // Server Data
    private static int id = 0;                  // Client ID Values
    private static final int PORT = 5000;       // Default Server Socket PORT


    /**
     * Starts the Server right on Startup
     */
    public static void main(String[] args) {
        // Start the Server on Startup
        try(ServerSocket serverSocket = new ServerSocket(PORT)){
            System.out.println("Server initialized");

            // Wait for Client Connections
            // Add a Client Thread to each Connection
            while(true){
                System.out.println("Waiting for clients...");
                Socket socket = serverSocket.accept();
                System.out.println("Client found");

                // Create a ClientThread with new Socket Cnnection
                // Give the ClientThread an id
                // Increment the id
                ClientThread client = new ClientThread(socket, id);
                id++;

                // Add the new ClientThread to a Client List
                // Begin the Client Thread
                clientList.add(client);
                client.start();
                System.out.println("Client connected");
            }
        }

        // Handle any Exception to Starting the Server
        catch(IOException e){
            e.printStackTrace();
        }
    }

    /** @return Client Array List */
    static ArrayList<ClientThread> getClientList(){
        return clientList;
    }

    /** @return Users Array List */
    static ArrayList<String> getUsersList() { return usersList; }

    /**
     * Removes a Client from the Client and User Array List
     *  based on their given IDs
     *
     * @param id - The index ID of Client
     */
    static void removeFromList(int id){
        // Find the Client from the User List based on their ID
        // Get the Client's Index in the Lists
        ClientThread ct = getClientOfID(id);
        int index = usersList.indexOf(ct.getUsername());
        String disconnectedUser = usersList.get(index);

        // Remove the Client from the Lists
        usersList.remove(index);
        clientList.remove(index);

        notifyClientsOfDisconnect(disconnectedUser);
    }

    /**
     * Finds the Client with given ID
     *
     * @param id - The ID of the Client
     * @return Client Thread based on ID (null if not found)
     */
    static ClientThread getClientOfID(int id) {
        // Search for the Client with the given ID
        for(ClientThread ct : ServerMain.clientList) {
            if(ct.getClientID() == id) {
                return ct;
            }
        }

        // Client not Found
        return null;
    }

    /**
     * Adds Username to the User List
     * @param username - The String Username
     */
    static void addUserToList(String username){
        usersList.add(username);
    }

    /**
     * Prompts server that the user disconnected
     *
     * @param user - The Disconnected User
     */
    private static void notifyClientsOfDisconnect(String user){
        // Create a Message Packet will null content
        // Set the Packet's Contents required for the client thread
        //  to recognize disconnect
        MessagePacket packet = new MessagePacket(null, user);
        packet.setConnectingStatus(false);
        packet.setChatList(usersList);              // Send updated ChatList

        // Send Packet to all connected Users
        for(ClientThread ct : clientList){
            ct.sendDisconnectUpdate(packet);
        }
    }
}