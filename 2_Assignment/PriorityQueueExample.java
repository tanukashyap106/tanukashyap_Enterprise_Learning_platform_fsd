import java.util.PriorityQueue;

public class PriorityQueueExample {

    public static void main(String[] args) {

        PriorityQueue<String> pq = new PriorityQueue<>();

        pq.offer("Banana");
        pq.offer("Apple");
        pq.offer("Orange");
        pq.offer("Mango");

        while (!pq.isEmpty()) {
            System.out.println(pq.poll());
        }
    }
}