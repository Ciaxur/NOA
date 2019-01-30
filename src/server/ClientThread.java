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

    private Socket socket;
    private int id;
    private MessagePacket msgPack = null;
    private ObjectOutputStream output = null;
    private ObjectInputStream input = null;
    private String username;


    ClientThread(Socket socket, int id){
        this.socket = socket;
        this.id = id;
    }

    public void run(){
        try {
            output = new ObjectOutputStream(socket.getOutputStream());

            while(true) {
                // had to redeclare in loop because not appendable, maybe because receiving from different output streams
                input = new ObjectInputStream(socket.getInputStream());

                msgPack = (MessagePacket) input.readObject();

                if(msgPack.getContentsData() == null){
                    msgPack.setConnectingStatus(true);
                    username = msgPack.getUsername();
                    ServerMain.addUserToList(username);
                    msgPack.setChatList(ServerMain.getUsersList());
                }

                for (ClientThread ct : ServerMain.getClientList()) {
                    if(msgPack.getContentsData() != null) {
                        if (this.id != ct.id) {
                            ct.output.writeObject(msgPack);
                            ct.output.flush();
                        }
                    } else {
                        if(this.id != ct.id) {
                            ct.output.writeObject(msgPack);
                            ct.output.flush();
                        }
                        else{
                            msgPack.setUsername("You");
                            ct.output.writeObject(msgPack);
                            ct.output.flush();
                            msgPack.setUsername(username);
                        }
                    }
                }
                output.reset();
            }
        } catch (SocketException se) {
            se.printStackTrace();
        }
        catch (IOException e){
            e.printStackTrace();
        }
        catch (ClassNotFoundException e1) {
            e1.printStackTrace();
        } finally {
            closeClient();
        }
    }

    void decrementIndex(){
        id--;
    }

    private void closeClient() {
        try {
            socket.close();
            input.close();
            output.close();
            ServerMain.removeFromList(id);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    void sendDisconnectUpdate(MessagePacket packet){
        try {
            output.writeObject(packet);
        } catch (IOException e){
            e.printStackTrace();
        }
    }
}

