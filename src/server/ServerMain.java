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

    private static ArrayList<ClientThread> clientList = new ArrayList<>();
    private static ArrayList<String> usersList = new ArrayList<>();
    private static int id = 0;
    private static final int PORT = 5000;       // Default Server Socket PORT

    public static void main(String[] args) {

        try(ServerSocket serverSocket = new ServerSocket(PORT)){
            System.out.println("Server initialized");
            while(true){
                System.out.println("Waiting for clients...");
                Socket socket = serverSocket.accept();
                System.out.println("Client found");
                ClientThread client = new ClientThread(socket, id);
                id++;
                clientList.add(client);
                client.start();
                System.out.println("Client connected");
            }
        } catch(IOException e){
            e.printStackTrace();
        }
    }

    static ArrayList<ClientThread> getClientList(){
        return clientList;
    }

    static ArrayList<String> getUsersList() { return usersList; }

    static void removeFromList(int index){
        String disconnectedUser = usersList.get(index);
        usersList.remove(index);
        clientList.remove(index);
        id--;

        for(int i = index; i < clientList.size(); i++){
            clientList.get(i).decrementIndex();
        }

        notifyClientsOfDisconnect(disconnectedUser);
    }

    static void addUserToList(String username){
        usersList.add(username);
    }

    private static void notifyClientsOfDisconnect(String user){
        MessagePacket packet = new MessagePacket(null, user);
        packet.setConnectingStatus(false);
        packet.setChatList(usersList);

        for(ClientThread ct : clientList){
            ct.sendDisconnectUpdate(packet);
        }
    }
}