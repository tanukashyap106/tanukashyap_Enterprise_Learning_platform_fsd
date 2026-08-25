package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.FlashcardDeck;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.FlashcardDeckRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardDeckController {

    private final FlashcardDeckRepository flashcardDeckRepository;
    private final UserRepository userRepository;

    public FlashcardDeckController(FlashcardDeckRepository flashcardDeckRepository, UserRepository userRepository) {
        this.flashcardDeckRepository = flashcardDeckRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Claims)) {
            return null;
        }
        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDecks() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<FlashcardDeck> decks = flashcardDeckRepository.findByUserId(user.getId());

        // Pre-populate sample decks on start if none exist
        if (decks.isEmpty()) {
            List<FlashcardDeck> samples = createSampleDecks(user.getId());
            flashcardDeckRepository.saveAll(samples);
            decks = flashcardDeckRepository.findByUserId(user.getId());
        }

        response.put("success", true);
        response.put("decks", decks);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createDeck(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String title = (String) request.get("title");
        String description = (String) request.get("description");
        String category = (String) request.get("category");
        String categoryLabel = (String) request.get("categoryLabel");
        String cardsJson = (String) request.get("cardsJson");
        Integer cardsCount = (Integer) request.get("cardsCount");

        if (title == null || title.trim().isEmpty() || cardsJson == null) {
            response.put("success", false);
            response.put("message", "Title and cards are required");
            return ResponseEntity.status(400).body(response);
        }

        FlashcardDeck deck = new FlashcardDeck(
                user.getId(),
                title.trim(),
                description != null ? description.trim() : "",
                category != null ? category.trim() : "frontend",
                categoryLabel != null ? categoryLabel.trim() : "React & Frontend",
                cardsCount != null ? cardsCount : 0,
                0,
                "Just now",
                cardsJson
        );

        FlashcardDeck saved = flashcardDeckRepository.save(deck);
        response.put("success", true);
        response.put("deck", saved);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<Map<String, Object>> updateReviewStats(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Optional<FlashcardDeck> optionalDeck = flashcardDeckRepository.findById(id);
        if (optionalDeck.isEmpty() || !optionalDeck.get().getUserId().equals(user.getId())) {
            response.put("success", false);
            response.put("message", "Deck not found");
            return ResponseEntity.status(404).body(response);
        }

        FlashcardDeck deck = optionalDeck.get();
        if (request.containsKey("mastery")) {
            deck.setMastery((Integer) request.get("mastery"));
        }
        deck.setLastReviewed("Just now");
        FlashcardDeck saved = flashcardDeckRepository.save(deck);

        response.put("success", true);
        response.put("deck", saved);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDeck(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Optional<FlashcardDeck> optionalDeck = flashcardDeckRepository.findById(id);
        if (optionalDeck.isEmpty() || !optionalDeck.get().getUserId().equals(user.getId())) {
            response.put("success", false);
            response.put("message", "Deck not found");
            return ResponseEntity.status(404).body(response);
        }

        flashcardDeckRepository.delete(optionalDeck.get());
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    private List<FlashcardDeck> createSampleDecks(Long userId) {
        List<FlashcardDeck> samples = new ArrayList<>();

        // 1. React Decks
        samples.add(new FlashcardDeck(
                userId,
                "React & Hooks Mastery",
                "Essential React concepts, useState, useEffect, useMemo, custom hooks, and Virtual DOM internals.",
                "frontend",
                "React & Frontend",
                4,
                85,
                "2 hours ago",
                "[" +
                "{\"id\":\"c1\",\"question\":\"What is the Virtual DOM and how does React use diffing?\",\"answer\":\"The Virtual DOM is a lightweight JS representation of the real DOM. React creates a new tree on state change, compares it with the previous snapshot using a diffing algorithm, and efficiently updates only changed nodes in the actual DOM.\",\"code\":\"const VirtualDOMExample = () => {\\\\n  const [count, setCount] = useState(0);\\\\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\\\\n};\",\"difficulty\":\"medium\"}," +
                "{\"id\":\"c2\",\"question\":\"When should you use `useCallback` vs `useMemo`?\",\"answer\":\"`useCallback(fn, deps)` caches a function instance across renders, while `useMemo(() => value, deps)` caches the result of a calculation.\",\"code\":\"const memoizedFn = useCallback(() => doSomething(a, b), [a, b]);\\\\nconst memoizedVal = useMemo(() => computeHeavy(a), [a]);\",\"difficulty\":\"medium\"}," +
                "{\"id\":\"c3\",\"question\":\"What is the key rule of React Hooks?\",\"answer\":\"Hooks must only be called at the top level of React function components or custom hooks. Never call hooks inside loops, conditions, or nested functions.\",\"difficulty\":\"easy\"}," +
                "{\"id\":\"c4\",\"question\":\"Explain React Fiber architecture.\",\"answer\":\"React Fiber is the re-implementation of React's core reconciliation algorithm. It enables incremental rendering, splitting work into chunks across multiple frames for high FPS UI.\",\"difficulty\":\"hard\"}" +
                "]"
        ));

        // 2. DSA
        samples.add(new FlashcardDeck(
                userId,
                "Data Structures & Algorithms",
                "Core DSA concepts, Big O notation, Trees, Graphs, Sorting, and Dynamic Programming fundamentals.",
                "dsa",
                "DSA",
                3,
                70,
                "1 day ago",
                "[" +
                "{\"id\":\"c5\",\"question\":\"What is the time complexity of QuickSort in best vs worst case?\",\"answer\":\"Best & Average Case: O(N log N) when pivot splits array evenly. Worst Case: O(N²) when pivot is always smallest or largest element.\",\"code\":\"// Pivot partitioning strategy\\\\nint partition(int arr[], int low, int high) {\\\\n  int pivot = arr[high]; ...\\\\n}\",\"difficulty\":\"medium\"}," +
                "{\"id\":\"c6\",\"question\":\"Explain the difference between BFS and DFS in Graph traversal?\",\"answer\":\"BFS uses a Queue data structure to explore level-by-level (ideal for shortest paths). DFS uses a Stack/Recursion to visit deep paths first.\",\"difficulty\":\"easy\"}," +
                "{\"id\":\"c7\",\"question\":\"What is Dynamic Programming and when to apply memoization?\",\"answer\":\"DP solves complex problems by breaking them into overlapping subproblems and optimal substructure. Memoization stores solutions to subproblems to avoid redundant recalculations.\",\"difficulty\":\"hard\"}" +
                "]"
        ));

        // 3. System Design
        samples.add(new FlashcardDeck(
                userId,
                "System Design & Microservices",
                "Scalability patterns, Load Balancers, Caching strategies, Database Sharding, and Event-driven Architecture.",
                "system",
                "System Design",
                2,
                60,
                "3 days ago",
                "[" +
                "{\"id\":\"c8\",\"question\":\"What is the CAP Theorem in Distributed Systems?\",\"answer\":\"CAP states that a distributed system can guarantee at most TWO out of three properties simultaneously: Consistency (C), Availability (A), and Partition Tolerance (P).\",\"difficulty\":\"medium\"}," +
                "{\"id\":\"c9\",\"question\":\"What is Database Sharding and Horizontal Scaling?\",\"answer\":\"Sharding partitions a dataset across multiple database instances based on a shard key, enabling horizontal read/write scale beyond a single machine.\",\"difficulty\":\"hard\"}" +
                "]"
        ));

        // 4. Python
        samples.add(new FlashcardDeck(
                userId,
                "Python Async & Backend",
                "Asyncio, Decorators, Generators, FastAPI dependency injection, and RESTful API best practices.",
                "backend",
                "Python Backend",
                1,
                90,
                "5 hours ago",
                "[" +
                "{\"id\":\"c10\",\"question\":\"How do Python Async / Await and Event Loop work?\",\"answer\":\"Async functions return coroutines. The Event Loop pauses execution at `await` keyword, allowing other non-blocking tasks to run concurrently on a single thread.\",\"code\":\"import asyncio\\\\nasync def fetch_data():\\\\n    await asyncio.sleep(1)\\\\n    return {'status': 'success'}\",\"difficulty\":\"easy\"}" +
                "]"
        ));

        return samples;
    }
}
