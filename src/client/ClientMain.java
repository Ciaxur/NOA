package client;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

/*
 * 	Main class of the client side of the project, it is used to initialize and display the login page
 */

public class ClientMain extends Application {

    @Override
    public void start(Stage primaryStage) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("chatLoginGui.fxml"));
            Parent root = loader.load();

            LoginController loginController = loader.getController();
            loginController.setStage(primaryStage);

            Scene scene = new Scene(root);
            primaryStage.setTitle("NOA");
            primaryStage.initStyle(StageStyle.UNDECORATED);
            primaryStage.setScene(scene);
            primaryStage.getIcons().add(new Image("client/noa_icon.png"));
            primaryStage.show();
        } catch (Exception e){
            e.printStackTrace();
        }
    }


    public static void main(String[] args) {
        launch(args);
    }
}
