public class ExceptionExample {

    public static void main(String[] args) {

        try {
            int result = 10 / 0;
            System.out.println(result);
        }

        catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero.");
        }

        finally {
            System.out.println("Program Finished.");
        }
    }
}