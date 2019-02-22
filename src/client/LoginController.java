package client;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.control.ToolBar;
import javafx.scene.image.Image;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controller for the login stage, allows for the window to be dragged and the username inputted
 * to be saved as the username for the client throughout the clients duration
 */
public class LoginController implements Initializable {

    // FXML Data
    @FXML private TextField usernameText;
    @FXML private ToolBar titleBar;
    @FXML private Button closeButton;
    @FXML private Button miniButton;
    @FXML private Label errorLabel;

    // JAVAFX Data
    private Stage primaryStage;
    private double xPos, yPos;

    /**
     * Constructor for the Login GUI
     *  Sets a few GUI Properties
     */
    @Override
    public void initialize(URL url, ResourceBundle resource) {
        // Setup Title Bar Properties
        titleBar.setOnMousePressed(e->{
            xPos = primaryStage.getX() - e.getScreenX();
            yPos = primaryStage.getY() - e.getScreenY();
        });
        titleBar.setOnMouseDragged(e->{
            primaryStage.setX(e.getScreenX() + xPos);
            primaryStage.setY(e.getScreenY() + yPos);
        });

        // Setup Properties of the Buttons
        closeButton.setPadding(Insets.EMPTY);
        miniButton.setPadding(Insets.EMPTY);
    }


    /** Handle Close Button Click */
    @FXML
    private void closeClicked(){
        System.exit(0);
    }

    /** Handle Minimize Button Click */
    @FXML
    private void miniClicked(MouseEvent e){
        ((Stage)((Button)e.getSource()).getScene().getWindow()).setIconified(true);
    }

    /**
     * Initiates the Client Controller and Closes down
     *  the current Login Controller
     */
    @FXML
    private void initSubmit() throws IOException {
        // Validate Username Entry
        if(!usernameText.getText().trim().equals("")){
            // Load up the Client Chat GUI
            FXMLLoader loader = new FXMLLoader(getClass().getResource("serverChatGui.fxml"));
            Parent root = loader.load();
            Stage stage = new Stage();

            // Load up the Client Controller and setup Stage Properties
            // Start the Controller
            Controller controller = loader.getController();
            controller.setStage(stage);
            controller.userName(usernameText.getText());
            controller.runClient();

            // Create the Scene GUI
            // Setup Properties and Show
            // Close up the Current Login Controller
            Scene scene = new Scene(root);
            stage.setTitle("NOA");
            stage.initStyle(StageStyle.UNDECORATED);
            stage.setScene(scene);
            stage.getIcons().add(new Image("client/noa_icon.png"));
            stage.show();
            primaryStage.close();
        }

        // Invalid Username Entry
        else{
            errorLabel.setText("Please enter a username");
        }
    }

    /**
     * Handle Submit "Enter" KeyPress
     *
     * @param key - The Key Pressed Object
     */
    @FXML
    private void submitKeyPressed(KeyEvent key) throws Exception {
        if(key.getCode() == KeyCode.ENTER){
            initSubmit();
        }
    }


    /** Sets Current Primary Stage
     *
     * @param primaryStage - The Primary Stage
     */
    public void setStage(Stage primaryStage){
        this.primaryStage = primaryStage;
    }
}
