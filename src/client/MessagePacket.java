package client;

import java.io.Serializable;
import java.util.ArrayList;


/**
 * This object is used to hold data sent between the server and client, to include the
 *  content of the message sent, the user's name, the list of users connected to the
 *  server, and if the message is null (user connecting or disconnecting from the server)
 *  then to define if the user is connecting to the server (isConnecting = true) or
 *  if the user is disconnecting (isConnecting = false)
 */
public class MessagePacket implements Serializable {
    // Message Packet Serial Version UID (needed to be sent through streams)
    private static final long serialVersionUID = 8675309L; // Jenny

    // Message Packet Data
    private String content, username;                           // Message Content, Username
    private boolean isConnecting = false;                       // (User Connecting / Disconnecting)
    private ArrayList<String> chatList = new ArrayList<>();     // Chat List Array


    /**
     * MessagePacket Constructor
     *  Sets Initial Data to NULL
     */
    MessagePacket() {
        this.setData(null, null);
    }

    /**
     * MessagePacket Constructor
     *  Sets Initial Data
     *
     * @param content - Message Content Text
     * @param username  - User's Name that's Sending this Packet
     */
    public MessagePacket(String content, String username) {
        this.setData(content, username);
    }

    /**
     * Sets Message Packet Data
     *
     * @param content - Message Content Text
     * @param username - User's Name that's sending this Packet
     */
    public void setData(String content, String username) {
        this.content = content;
        this.username = username;
    }

    /**
     * Sets the Connection Status
     *  If false -> No new User
     *  If true  -> New User
     *
     * @param isConnecting - Whether a User is Connecting or not
     */
    public void setConnectingStatus(boolean isConnecting){
        this.isConnecting = isConnecting;
    }

    /** @return Connecting Status */
    public boolean getConnectingStatus(){
        return isConnecting;
    }

    /** @return Message Content Text */
    public String getContentsData() {
        return this.content;
    }

    /** @return  User's Name */
    public String getUsername() {
        return this.username;
    }

    /**
     * Sets the Packet's Username
     *
     * @param username - The User's Name
     */
    public void setUsername(String username){
        this.username = username;
    }

    /**
     * Overwrites current Chat List Array
     *
     * @param chatList - The New Updated Chat List
     */
    public void setChatList(ArrayList<String> chatList){
        this.chatList.clear();
        this.chatList.addAll(chatList);
    }

    /** @return Packet's ChatList */
    public ArrayList<String> getChatList(){ return chatList; }
}

