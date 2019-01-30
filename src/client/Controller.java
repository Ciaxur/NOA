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

/*
 * The primary controller that sends and receives messages from the server as well as controlling
 * fxml functions and variables
 */

public class Controller implements Initializable {

    @FXML private ToolBar headerBar;
    @FXML private TextArea chatBar;
    @FXML private Button closeButton;
    @FXML private Button miniButton;
    @FXML private ToggleButton usersListButton;
    @FXML public ListView chatList;

    private Stage stage, usersStage;
    private double xPos, yPos;
    private Socket socket = null;
    private MessagePacket msgOut = null;
    private MessagePacket msgIn = null;
    private String username;
    private ListView<String> onlineUsersList;


    private static ObservableList<VBox> oList = FXCollections.observableArrayList();
    private static ObservableList<String> obUserList = FXCollections.observableArrayList();

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

        chatBar.setWrapText(true);

        closeButton.setPadding(Insets.EMPTY);
        miniButton.setPadding(Insets.EMPTY);
    }

    @FXML
    private void closeClicked() {
        System.exit(0);
    }

    @FXML
    private void minimizeStage(MouseEvent e){
        ((Stage)((Button)e.getSource()).getScene().getWindow()).setIconified(true);
        if(usersStage.isShowing()) { usersListButton.fire(); }
    }
    
    // on clicked method for the send button
    @FXML private void sendMessage(){
        VBox chatBlock = new VBox();
        chatBlock.setId("chatBlock");

        String msg = chatBar.getText().trim();
        chatBar.clear();

        Label chatText = new Label(msg);
        chatText.setId("chatText");
        chatText.setWrapText(true);
        chatBlock.getChildren().add(chatText);

        Label chatName = new Label(username);
        chatName.setId("chatName");

        chatBlock.getChildren().add(chatName);

        oList.add(chatBlock);
        sendToServer(msg, chatName.getText());
        chatList.setItems(oList);
        chatList.scrollTo(chatList.getItems().size()-1);
        chatBar.requestFocus();
    }
    
    //Ctrl + Enter sends message
    @FXML
    private void enterClicked(KeyEvent ke){
        if(ke.isControlDown() && ke.getCode() == KeyCode.ENTER) { 
            sendMessage();
        }
    }
    
    //shows or hides the list of users connected to the server
    @FXML
    private void usersListToggled(){
        if(usersStage.isShowing()){
            usersStage.hide();
        } else {
            usersStage.setX(stage.getX() + 440);
            usersStage.setY(stage.getY() + 40);
            usersStage.show();
        }
    }
    
    // main method of the class which runs a thread to listen for incoming messages, connected, or disconnected users
    void runClient(){
        try {
            socket = new Socket("localhost", 5000);
            System.out.println("Sockets connected");

            msgOut = new MessagePacket();

            ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
            msgOut.setData(null, username);
            out.writeObject(msgOut);

            onlineUsersList = new ListView<>();
            onlineUsersList.setId("onlUsersList");
            Label uListLabel = new Label("Users:");
            uListLabel.setId("uListLbl");
            VBox usersListBox = new VBox(uListLabel, onlineUsersList);
            usersListBox.setId("uLBox");

            Runnable msgListener = () ->{
                try {
                    // unlike server input stream, had to declare outside loop, maybe because receiving from only one output stream
                    ObjectInputStream input = new ObjectInputStream(socket.getInputStream());

                    while (true) {

                        msgIn = (MessagePacket) input.readObject();
                        
                        // if content is not null it means it's not a user connecting or disconnecting but a
                        // message being received from another client
                        if (msgIn.getContentsData() != null) {
                            VBox receivedBlock = new VBox();
                            receivedBlock.setId("receivedBlock");

                            Label receivedText = new Label();
                            receivedText.setId("receivedText");
                            receivedText.setWrapText(true);

                            Label senderName = new Label();
                            senderName.setId("senderName");

                            receivedBlock.getChildren().addAll(receivedText, senderName);

                            receivedText.setText(msgIn.getContentsData());
                            senderName.setText(msgIn.getUsername());
                            
                            // updates main chat screen
                            Platform.runLater(() -> {
                                oList.add(receivedBlock);
                                chatList.setItems(oList);
                            });
                        } else { // means a client is either connecting or disconnecting
                            Label userLabel;
                            if(msgIn.getConnectingStatus())
                                userLabel = new Label(msgIn.getUsername() + " connected");
                             else
                                userLabel = new Label(msgIn.getUsername() + " disconnected");

                            userLabel.setId("newUserLabel");

                            VBox newUserBlock = new VBox(userLabel);
                            newUserBlock.setId("newUserBlock");

                          //update main chat
                            Platform.runLater(() -> {                                
                                oList.add(newUserBlock);
                                chatList.setItems(oList);

                                // update list of active users
                                obUserList.setAll(msgIn.getChatList());
                                onlineUsersList.setItems(obUserList);
                            });
                        }

                    }
                } catch (IOException e1) { e1.printStackTrace(); }
                catch (ClassNotFoundException e2) { e2.printStackTrace(); }
            };
            new Thread(msgListener).start();

            Scene scene = new Scene(usersListBox, 200, 300);
            scene.getStylesheets().add("client/style.css");
            usersStage.setScene(scene);
            usersStage.initStyle(StageStyle.UNDECORATED);
            usersStage.initOwner(stage);
            usersStage.toFront();

        } catch(IOException e){
            e.printStackTrace();
        }
    }
    
    // outputs object with username and message to server
    private void sendToServer(String sentText, String sentName){
        try {
            ObjectOutputStream output = new ObjectOutputStream(socket.getOutputStream());

            msgOut.setData(sentText, sentName);

            output.writeObject(msgOut);

        } catch(IOException e){
            e.printStackTrace();
        }
    }

    void setStage(Stage stage){
        this.stage = stage;
    }

    void setName(String name) {
        username = name;
    }
}

