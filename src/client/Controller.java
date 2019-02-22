package client;

import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import javafx.scene.text.TextFlow;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import java.io.*;
import java.net.Socket;
import java.net.URL;
import java.util.ResourceBundle;


/**
 *  The primary controller that sends and receives messages from the server as well as controlling
 *   fxml functions and variables
 */
public class Controller implements Initializable {

    // FXML Objects Variables
    @FXML private ToolBar headerBar;
    @FXML private TextArea chatBar;
    @FXML private Button closeButton;
    @FXML private Button miniButton;
    @FXML private ToggleButton usersListButton;
    @FXML public ListView chatList;

    // JAVAFX Variables
    private Stage stage, usersStage;

    // Client Variables
    private double xPos, yPos;
    private Socket socket = null;
    private MessagePacket msgOut = null;
    private MessagePacket msgIn = null;
    private String username;
    private ListView<String> onlineUsersList;

    // Chat List Variables
    // oList -> The Chat List History that holds Chat Blocks (VBoxes)
    private static ObservableList<VBox> oList = FXCollections.observableArrayList();
    private static ObservableList<String> obUserList = FXCollections.observableArrayList();

    // DEBUG Variables
    private int PORT = 5000;                // Socket Port to Connect to
    private String HOST = "localhost";      // Socket Host URL to Connect to



    /**
     * JAVAFX Override Method
     *  Pretty Much a Constructor
     */
    @Override
    public void initialize(URL url, ResourceBundle resource) {
        usersStage = new Stage();
        
        // Allows for stage to be moved around by dragging the toolbar aka headerBar
        headerBar.setOnMousePressed(e->{
            xPos = stage.getX() - e.getScreenX();
            yPos = stage.getY() - e.getScreenY();
        });
        headerBar.setOnMouseDragged(e->{
            stage.setX(e.getScreenX() + xPos);
            stage.setY(e.getScreenY() + yPos);
            usersStage.setX(stage.getX() + 440);
            usersStage.setY(stage.getY() +40);
        });


        // Chat Bar Properties
        chatBar.setWrapText(true);

        // Toolbar Buttons
        closeButton.setPadding(Insets.EMPTY);
        miniButton.setPadding(Insets.EMPTY);
    }

    /** FXML Method - Close the Client Application */
    @FXML
    private void closeClicked() {
        System.exit(0);
    }

    /** FXML Method - Minimize Client Application */
    @FXML
    private void minimizeStage(MouseEvent e){
        ((Stage)((Button)e.getSource()).getScene().getWindow()).setIconified(true);
        if(usersStage.isShowing()) { usersListButton.fire(); }
    }
    
    /**
     * FXML Method - Sends a Message in the Message Text Box
     *  Handles:
     *      - Message Sending
     *      - Chat History
     *
     * @param cleanStr - Cleaned/Modified String | Trimmed and ready to go
     */
    @FXML
    private void sendMessage(String cleanStr){
        // Create a ChatBlock
        VBox chatBlock = new VBox();
        chatBlock.setId("chatBlock");

        // Obtain the Massage from the Message Box
        // Clean up the Text
        String msg = cleanStr;
        chatBar.clear();


        // Add the Message to a Chat Block for Chat History
        //  to show Sent & Received Message and from whom
        // Create a Label Object
        // Set Properties for the Label
        // Append the Label to the ChatBlock Object
        Label chatText = new Label(msg);
        chatText.setId("chatText");
        chatText.setWrapText(true);
        chatBlock.getChildren().add(chatText);

        // Create a Label to hold the User's Name
        // Set Properties for it
        // Append Label to the ChatBlock Object
        Label chatName = new Label(username);
        chatName.setId("chatName");
        chatBlock.getChildren().add(chatName);

        // Add the Chat Block to the Chat History List
        // Send the Message Data to the Server
        // Apply the Chat History List to the Current Chat List
        // Scroll to newest message
        oList.add(chatBlock);
        sendToServer(msg, chatName.getText());
        chatList.setItems(oList);
        chatList.scrollTo(chatList.getItems().size()-1);
        chatBar.requestFocus();
    }
    
    /**
     * Handles Key Presses on Chat Message Box
     *  Sends Message
     *  Create a new line
     *
     * @param key - KeyEvent Object
     */
    @FXML
    private void keyPressed(KeyEvent key){
        // Append a New Line
        if(key.isControlDown() && key.getCode() == KeyCode.ENTER) {
            chatBar.appendText("\n");
        }

        // Only Enter was clicked, so Send Message!
        else if (key.getCode() == KeyCode.ENTER){
            // Verify Chat Text is not Empty!
            String str = chatBar.getText().trim();

            // If valid, send message
            if(str.length() != 0) {
                sendMessage(str);
            }

            // Clear ChatBox
            else {
                chatBar.clear();
            }
        }
    }
    
    /** Toggles Online User List */
    @FXML
    private void usersListToggled(){
        // Hide List
        if(usersStage.isShowing()){
            usersStage.hide();
        }

        // Show List
        else {
            usersStage.setX(stage.getX() + 440);
            usersStage.setY(stage.getY() + 40);
            usersStage.show();
        }
    }



    /**
     * Handles Client Thread
     *  - Listens for Incoming Messages
     *  - Handles New Connected Users
     *  - Handles Disconnected Users
     */
    public void runClient(){

        // Try Client Connection
        try {
            // Create/Connect to Socket
            // Display Connection Success in Console
            socket = new Socket(this.HOST, this.PORT);
            System.out.println("Sockets connected");

            // Create a Message Packet Object to notify
            //  other users Client Connected
            msgOut = new MessagePacket();
            msgOut.setData(null, username);

            // Create Output Stream to send out Message Packet Object
            ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
            out.writeObject(msgOut);

            // Create Online Users List
            // Setup List's Properties
            onlineUsersList = new ListView<>();
            onlineUsersList.setId("onlUsersList");
            Label uListLabel = new Label("Users:");
            uListLabel.setId("uListLbl");
            VBox usersListBox = new VBox(uListLabel, onlineUsersList);
            usersListBox.setId("uLBox");


            // Create a Runnable Interface to be run by a thread
            // This Thread Listens for Incoming Messages
            new Thread(()-> {
                try {
                    // Initiate Input Stream for Receiving Messages from Socket
                    ObjectInputStream input = new ObjectInputStream(socket.getInputStream());


                    // A While loop to "Listen" for incoming Messages
                    while (true) {
                        // Try to read from the Input Stream
                        // Input Stream receives a Message Packet Object
                        //  convert the Object to a MessagePacket
                        msgIn = (MessagePacket) input.readObject();


                        // Check if the Message Packet has Data in it (Message)
                        if (msgIn.getContentsData() != null) {
                            // Create a Chat Block
                            VBox receivedBlock = new VBox();
                            receivedBlock.setId("receivedBlock");

                            // Create a Label to hold the data
                            Label receivedText = new Label();
                            receivedText.setId("receivedText");
                            receivedText.setWrapText(true);

                            // Create a Label to hold the User's Name
                            Label senderName = new Label();
                            senderName.setId("senderName");

                            // Add both Data and Username labels into the Chat Block
                            receivedBlock.getChildren().addAll(receivedText, senderName);

                            // Add the Text into the Labels
                            receivedText.setText(msgIn.getContentsData());
                            senderName.setText(msgIn.getUsername());
                            
                            // Update Main Chat Screen
                            // RunLater is because Calculation takes time
                            //  so when it can, update the Chat Screen
                            Platform.runLater(() -> {
                                oList.add(receivedBlock);
                                chatList.setItems(oList);
                            });
                        }


                        // Message Packet Contents are null meaning
                        //  New User Connected or a User Disconnected
                        else {
                            // Create a Label for the User Connect/Disconnect
                            Label userLabel;

                            // Get Connection Status (Connected/Disconnected)
                            // Set the Label to Match Status
                            if(msgIn.getConnectingStatus())
                                userLabel = new Label(msgIn.getUsername() + " connected");
                            else
                               userLabel = new Label(msgIn.getUsername() + " disconnected");

                            userLabel.setId("newUserLabel");

                            // Create a Chat Block
                            VBox newUserBlock = new VBox(userLabel);
                            newUserBlock.setId("newUserBlock");

                            // Update Main Chat with that Chat Block
                            Platform.runLater(() -> {
                                // Add Block
                                oList.add(newUserBlock);
                                chatList.setItems(oList);

                                // Update Online User List
                                obUserList.setAll(msgIn.getChatList());
                                onlineUsersList.setItems(obUserList);
                            });
                        }
                    }
                }

                // Handle Exceptions
                catch (IOException e1) { e1.printStackTrace(); }
                catch (ClassNotFoundException e2) { e2.printStackTrace(); }
            }).start();


            // Create the Client GUI Scene
            Scene scene = new Scene(usersListBox, 200, 300);
            usersStage.setScene(scene);
            usersStage.initStyle(StageStyle.UNDECORATED);
            usersStage.initOwner(stage);
            usersStage.toFront();
        }

        // Catch Connection Exception
        catch(IOException e){
            e.printStackTrace();
        }
    }
    
    // outputs object with username and message to server
    /**
     * Sends Message Packet to Server to handle distribution to
     *  other Connected Clients
     *
     * @param message - Message Content
     * @param username - User's Name
     */
    private void sendToServer(String message, String username){
        // Create Output Stream to Send an Object
        // Setup MessagePacket with data and send to Server to handle
        try {
            ObjectOutputStream output = new ObjectOutputStream(socket.getOutputStream());
            msgOut.setData(message, username);
            output.writeObject(msgOut);
        }

        // Handle Output Stream Exceptions
        catch(IOException e){
            e.printStackTrace();
        }
    }


    /**
     * JAVAFX Stage to be set from Login Controller
     *
     * @param stage - Stage Object to use
     */
    public void setStage(Stage stage){
        this.stage = stage;
    }

    /**
     * Sets the Client's Username
     *
     * @param username - The New Username
     */
    public void userName(String username) {
        this.username = username;
    }
}

