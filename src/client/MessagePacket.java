package client;

import java.io.Serializable;
import java.util.ArrayList;

/*
 * This object is used to hold data sent between the server and client, to include the content of the message sent,
 * the user's name, the list of users connected to the server, and if the message is null (so a user is either connecting
 * or disconnecting from the server) then to define if the user is connecting to the server (isConnecting = true) or
 * if the user is disconnecting (isConnecting = false)
 */

public class MessagePacket implements Serializable {
    private static final long serialVersionUID = 8675309L; // Jenny

    private String content, username;
    private boolean isConnecting = false;
    private ArrayList<String> chatList = new ArrayList<>();

    MessagePacket() {
        this.setData(null, null);
    }

    public MessagePacket(String content, String name) {
        this.setData(content, name);
    }

    void setData(String content, String name) {
        this.content = content;
        this.username = name;
    }

    public void setConnectingStatus(boolean isConnecting){
        this.isConnecting = isConnecting;
    }

    boolean getConnectingStatus(){
        return isConnecting;
    }

    public String getContentsData() {
        return this.content;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public void setChatList(ArrayList<String> chatList){
        this.chatList.clear();
        this.chatList.addAll(chatList);
    }

    ArrayList<String> getChatList(){ return chatList; }
}

