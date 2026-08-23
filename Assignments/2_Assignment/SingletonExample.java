class Singleton {

    private static Singleton object = new Singleton();

    private Singleton() {

    }

    public static Singleton getInstance() {

        return object;

    }

    public void display() {

        System.out.println("Singleton Object Created");

    }

}

public class SingletonExample {

    public static void main(String[] args) {

        Singleton s = Singleton.getInstance();

        s.display();

    }

}