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

/*
 * Controller for the login stage, allows for the window to be dragged and the username inputted
 * to be saved as the username for the client throughout the clients duration
 */

public class LoginController implements Initializable {

    @FXML private TextField usernameText;
    @FXML private ToolBar headerBar;
    @FXML private Button closeButton;
    @FXML private Button miniButton;
    @FXML private Label errorLabel;

    private Stage primaryStage;
    private double xPos, yPos;

    @Override
    public void initialize(URL url, ResourceBundle resource) {
        headerBar.setOnMousePressed(e->{
            xPos = primaryStage.getX() - e.getScreenX();
            yPos = primaryStage.getY() - e.getScreenY();
        });
        headerBar.setOnMouseDragged(e->{
            primaryStage.setX(e.getScreenX() + xPos);
            primaryStage.setY(e.getScreenY() + yPos);
        });

        closeButton.setPadding(Insets.EMPTY);
        miniButton.setPadding(Insets.EMPTY);

    }

    @FXML
    private void closeClicked(){
        System.exit(0);
    }

    @FXML
    private void miniClicked(MouseEvent e){
        ((Stage)((Button)e.getSource()).getScene().getWindow()).setIconified(true);
    }

    @FXML
    private void submitClicked() throws IOException {
        if(!usernameText.getText().trim().equals("")){
            FXMLLoader loader = new FXMLLoader(getClass().getResource("serverChatGui.fxml"));
            Parent root = loader.load();

            Stage stage = new Stage();

            Controller controller = loader.getController();
            controller.setStage(stage);
            controller.setName(usernameText.getText());
            controller.runClient();

            Scene scene = new Scene(root);
            stage.setTitle("NOA");
            stage.initStyle(StageStyle.UNDECORATED);
            stage.setScene(scene);
            stage.getIcons().add(new Image("client/noa_icon.png"));
            stage.show();
            primaryStage.close();
        } else{
            errorLabel.setText("Please enter a username");
        }
    }

    @FXML
    private void submitKeyPressed(KeyEvent ke) throws Exception {
        if(ke.getCode() == KeyCode.ENTER){
            submitClicked();
        }
    }

    void setStage(Stage primaryStage){
        this.primaryStage = primaryStage;
    }
}
