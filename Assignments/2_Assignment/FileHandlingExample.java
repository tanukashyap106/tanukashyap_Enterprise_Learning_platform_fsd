import java.io.FileWriter;
import java.io.IOException;

public class FileHandlingExample {

    public static void main(String[] args) {

        try {

            FileWriter writer = new FileWriter("sample.txt");

            writer.write("Hello Java!");

            writer.close();

            System.out.println("File created successfully.");

        }

        catch (IOException e) {

            System.out.println("An error occurred.");

        }
    }
}