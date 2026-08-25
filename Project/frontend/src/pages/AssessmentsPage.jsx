import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import {
  FaHome, FaBook, FaCodeBranch, FaAward, FaCertificate, FaChartLine,
  FaFileInvoice, FaCog, FaSearch, FaSun, FaMoon, FaArrowLeft,
  FaSignOutAlt, FaRobot, FaRocket, FaBolt, FaClock, FaCheckCircle, FaExclamationCircle, FaCode
} from "react-icons/fa";
import "../styles/studentDashboard.css";

const ASSESSMENTS_LIST = [
  {
    id: "js",
    title: "JavaScript Basics Check",
    duration: 300,
    questions: [
      { q: "Which keyword defines block-scoped variables in modern ES6?", options: ["var", "let", "const", "Both let and const"], answer: 3 },
      { q: "What is the output of typeof null in JavaScript?", options: ["null", "undefined", "object", "string"], answer: 2 },
      { q: "Which event loop phase executes setImmediate callbacks?", options: ["Timers", "Poll", "Check", "Close"], answer: 2 },
      { q: "What is the result of '2' + 2 in JavaScript?", options: ["4", "22", "NaN", "TypeError"], answer: 1 },
      { q: "What is the result of '2' - 2 in JavaScript?", options: ["0", "22", "NaN", "TypeError"], answer: 0 },
      { q: "Which of the following is NOT a primitive data type in JavaScript?", options: ["String", "Number", "Boolean", "Object"], answer: 3 },
      { q: "How do you write a comment in JavaScript?", options: ["/* comment */", "// comment", "# comment", "Both A and B"], answer: 3 },
      { q: "What does the 'isNaN' function do?", options: ["Checks if value is not a number", "Converts value to a number", "Checks if value is null", "None of the above"], answer: 0 },
      { q: "Which operator is used to compare both value and type?", options: ["==", "===", "=", "!="], answer: 1 },
      { q: "How do you create a function in JavaScript?", options: ["function myFunction()", "def myFunction()", "create myFunction()", "function:myFunction()"], answer: 0 },
      { q: "Which array method removes the last element?", options: ["shift()", "pop()", "push()", "unshift()"], answer: 1 },
      { q: "Which array method adds an element to the beginning?", options: ["push()", "pop()", "unshift()", "shift()"], answer: 2 },
      { q: "What is the default value of an uninitialized variable?", options: ["null", "undefined", "0", "empty string"], answer: 1 },
      { q: "Which method merges two or more arrays?", options: ["concat()", "join()", "merge()", "slice()"], answer: 0 },
      { q: "How do you round a number to the nearest integer?", options: ["Math.ceil()", "Math.floor()", "Math.round()", "Math.rnd()"], answer: 2 },
      { q: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Online Node", "None of the above"], answer: 0 },
      { q: "Which statement stops loop execution?", options: ["continue", "return", "break", "stop"], answer: 2 },
      { q: "What is the output of typeof NaN?", options: ["'number'", "'NaN'", "'undefined'", "'object'"], answer: 0 },
      { q: "Which keyword refers to the current object in a method?", options: ["this", "self", "parent", "super"], answer: 0 },
      { q: "Which method converts a JSON string to a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.convert()"], answer: 1 },
      { q: "What is a closure in JavaScript?", options: ["A function with access to its outer scope", "A lock on variable access", "An ended loop", "None of the above"], answer: 0 },
      { q: "Which of the following is falsy in JavaScript?", options: ["0", "'' (empty string)", "undefined", "All of the above"], answer: 3 },
      { q: "Which method checks if an array contains a specific element?", options: ["includes()", "contains()", "has()", "find()"], answer: 0 },
      { q: "How do you write 'Hello World' in an alert box?", options: ["alert('Hello World')", "msg('Hello World')", "alertBox('Hello World')", "print('Hello World')"], answer: 0 },
      { q: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"], answer: 2 },
      { q: "Which method converts an object to a JSON string?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toString()"], answer: 0 },
      { q: "Which method creates a new array with elements that pass a test?", options: ["map()", "filter()", "reduce()", "forEach()"], answer: 1 },
      { q: "Which loop runs at least once?", options: ["for loop", "while loop", "do-while loop", "forEach loop"], answer: 2 },
      { q: "What is the result of Boolean('false')?", options: ["true", "false", "undefined", "TypeError"], answer: 0 },
      { q: "What is the engine Google Chrome uses to run JS?", options: ["SpiderMonkey", "V8", "Chakra", "JavaScriptCore"], answer: 1 }
    ],
    xpReward: 150
  },
  {
    id: "react",
    title: "React Hooks Proficiency",
    duration: 300,
    questions: [
      { q: "Which hook should be used to memoize complex computational values?", options: ["useEffect", "useCallback", "useMemo", "useRef"], answer: 2 },
      { q: "Can hooks be called inside conditional statements in React?", options: ["Yes, absolutely", "No, it violates Hooks rules", "Only inside useEffect", "Only in dev mode"], answer: 1 },
      { q: "What is the second argument of useEffect called?", options: ["Dependency array", "Cleanup handler", "State callback", "Prop map"], answer: 0 },
      { q: "How do you create a React component?", options: ["Function component", "Class component", "Both A and B", "Neither"], answer: 2 },
      { q: "What hook is used to manage local state?", options: ["useEffect", "useContext", "useState", "useReducer"], answer: 2 },
      { q: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "None of the above"], answer: 0 },
      { q: "How do you pass data to a child component?", options: ["Using state", "Using props", "Using context only", "Using ref"], answer: 1 },
      { q: "What hook should you use to run side effects?", options: ["useState", "useMemo", "useEffect", "useCallback"], answer: 2 },
      { q: "What hook is used to access the React context?", options: ["useContext", "useContextState", "useProvider", "useConsumer"], answer: 0 },
      { q: "Which hook returns a mutable ref object?", options: ["useState", "useMemo", "useRef", "useCallback"], answer: 2 },
      { q: "What is the purpose of keys in React lists?", options: ["To identify which items changed, are added, or are removed", "To style list items", "To speed up JavaScript execution", "None of the above"], answer: 0 },
      { q: "What is children prop in React?", options: ["A prop that allows nesting components", "A list of subcomponents", "A special state element", "None of the above"], answer: 0 },
      { q: "What does virtual DOM do?", options: ["Updates the real DOM directly", "Performs diffing and batch updates for efficient rendering", "Disables CSS styling", "None of the above"], answer: 1 },
      { q: "Which hook is designed to memoize callback functions?", options: ["useMemo", "useCallback", "useRef", "useEffect"], answer: 1 },
      { q: "What is StrictMode in React?", options: ["A tool for highlighting potential problems in an application", "A compilation warning mode", "A secure mode for APIs", "None of the above"], answer: 0 },
      { q: "How do you handle events in React?", options: ["Using camelCase names", "Using lowercase names", "Using inline strings", "None of the above"], answer: 0 },
      { q: "What is a controlled component in React?", options: ["A component controlled by state", "A component that doesn't render", "A secure component", "None of the above"], answer: 0 },
      { q: "Which hook can be used to reference a DOM element directly?", options: ["useRef", "useMemo", "useState", "useDOM"], answer: 0 },
      { q: "What is the default port for local React development (Vite)?", options: ["3000", "5000", "5173", "8080"], answer: 2 },
      { q: "Which React Hook is an alternative to useState for complex state logic?", options: ["useEffect", "useReducer", "useCallback", "useMemo"], answer: 1 },
      { q: "Can you write inline styles in React using CSS strings?", options: ["Yes, directly", "No, they must be specified as objects", "Only in class components", "None of the above"], answer: 1 },
      { q: "What does React.memo do?", options: ["Memoizes class components only", "Memoizes functional components to prevent unnecessary re-renders", "Saves state to local storage", "None of the above"], answer: 1 },
      { q: "Which lifecycle method corresponds to useEffect with an empty dependency array?", options: ["componentDidMount", "componentDidUpdate", "componentWillUnmount", "Both A and C"], answer: 0 },
      { q: "How do you clean up a subscription or interval inside useEffect?", options: ["Call useEffect.clear()", "Return a cleanup function from the effect callback", "Set state to null", "None of the above"], answer: 1 },
      { q: "What is the purpose of Fragment in React?", options: ["To group elements without adding extra nodes to the DOM", "To fragment the build file", "To speed up rendering", "None of the above"], answer: 0 },
      { q: "How does React propagate context value changes?", options: ["By re-rendering all consumer components", "By mutating the global window object", "By re-rendering the whole page", "None of the above"], answer: 0 },
      { q: "What is children prop type in standard React?", options: ["ReactNode", "String", "Array", "Object"], answer: 0 },
      { q: "Which hook runs synchronously after all DOM mutations but before browser paint?", options: ["useEffect", "useLayoutEffect", "useInsertionEffect", "useSyncExternalStore"], answer: 1 },
      { q: "What causes a React component to re-render?", options: ["Changes in state or props", "Calling forceUpdate()", "Parent component re-renders", "All of the above"], answer: 3 },
      { q: "What library is standard for routing in React?", options: ["React Router", "Redux", "Vite Router", "Spring Router"], answer: 0 }
    ],
    xpReward: 200
  },
  {
    id: "python",
    title: "Python Basics Check",
    duration: 300,
    questions: [
      { q: "Which data type is immutable in Python?", options: ["List", "Dictionary", "Set", "Tuple"], answer: 3 },
      { q: "How do you define a function in Python?", options: ["func name()", "def name():", "function name():", "define name()"], answer: 1 },
      { q: "Which operator is used for integer division in Python?", options: ["/", "//", "%", "div"], answer: 1 },
      { q: "What is the output of print(2 ** 3) in Python?", options: ["6", "8", "9", "5"], answer: 1 },
      { q: "How do you start a comment block in Python?", options: ["// comment", "/* comment */", "# comment", "-- comment"], answer: 2 },
      { q: "Which method adds an element to the end of a list?", options: ["add()", "insert()", "append()", "push()"], answer: 2 },
      { q: "What does the range(5) function return?", options: ["0 to 5 inclusive", "0 to 4 inclusive", "1 to 5 inclusive", "1 to 4 inclusive"], answer: 1 },
      { q: "How do you retrieve keys from a dictionary?", options: ["dict.keys()", "dict.get_keys()", "dict.all_keys()", "dict.items()"], answer: 0 },
      { q: "Which keyword checks if an item exists inside a list?", options: ["has", "exists", "in", "contains"], answer: 2 },
      { q: "What is the output of len('Hello') in Python?", options: ["4", "5", "6", "Error"], answer: 1 },
      { q: "How do you convert a string to lower case in Python?", options: ["str.lower()", "str.to_lower()", "str.lowercase()", "lower(str)"], answer: 0 },
      { q: "Which keyword is used to import a library?", options: ["include", "require", "import", "using"], answer: 2 },
      { q: "What is the correct file extension for Python files?", options: [".py", ".pyt", ".pyw", ".python"], answer: 0 },
      { q: "Which data structure stores unique elements only?", options: ["List", "Tuple", "Set", "Dictionary"], answer: 2 },
      { q: "What is the result of 9 % 2 in Python?", options: ["4", "1", "4.5", "0"], answer: 1 },
      { q: "How do you write a conditional statement in Python?", options: ["if (x > y):", "if x > y then:", "if x > y:", "if x > y"], answer: 2 },
      { q: "Which keyword creates a loop in Python?", options: ["for", "while", "Both A and B", "loop"], answer: 2 },
      { q: "What is a list comprehension?", options: ["A concise way to create lists", "A built-in list compressor", "A sorting algorithm", "None of the above"], answer: 0 },
      { q: "Which keyword defines a class in Python?", options: ["class", "Class", "define class", "object"], answer: 0 },
      { q: "How do you catch exceptions in Python?", options: ["try / catch", "try / except", "try / fail", "catch / throw"], answer: 1 },
      { q: "What is the default value returned by a function without a return statement?", options: ["null", "None", "0", "void"], answer: 1 },
      { q: "Which keyword outputs text to the standard console?", options: ["console.log()", "print()", "printf()", "echo()"], answer: 1 },
      { q: "What is the output of list(range(2, 5))?", options: ["[2, 3, 4, 5]", "[2, 3, 4]", "[3, 4, 5]", "[2, 4]"], answer: 1 },
      { q: "How do you add a key-value pair to a dictionary?", options: ["dict[key] = value", "dict.add(key, value)", "dict.push(key, value)", "dict.insert(key, value)"], answer: 0 },
      { q: "Which function converts a string to an integer?", options: ["int()", "str()", "float()", "integer()"], answer: 0 },
      { q: "What is self in Python classes?", options: ["Refers to the class object", "Refers to the instance of the class", "A reserved compiler token", "None of the above"], answer: 1 },
      { q: "Which method splits a string into a list of substrings?", options: ["split()", "join()", "divide()", "slice()"], answer: 0 },
      { q: "How do you check the type of an object in Python?", options: ["typeof()", "type()", "object.type", "class()"], answer: 1 },
      { q: "What is __init__ in Python?", options: ["A system shutdown method", "A constructor method for classes", "An initialization parameter", "None of the above"], answer: 1 },
      { q: "Which operator checks inequality?", options: ["!=", "<>", "not", "is not"], answer: 0 }
    ],
    xpReward: 150
  },
  {
    id: "uiux",
    title: "UI/UX Design Check",
    duration: 300,
    questions: [
      { q: "Which principle describes visual hierarchy?", options: ["Fitts' Law", "Rule of Thirds", "Gestalt Principles", "All of the above"], answer: 3 },
      { q: "What does UX stand for?", options: ["User Experience", "User Expansion", "Unified eXtension", "Unique eXploration"], answer: 0 },
      { q: "Which tool is primarily used for vector interface design?", options: ["Photoshop", "Word", "Figma", "Excel"], answer: 2 },
      { q: "What is a wireframe in UI/UX?", options: ["A high-fidelity layout", "A low-fidelity structural blueprint", "A database schema", "A color palette chart"], answer: 1 },
      { q: "What does UI stand for?", options: ["User Integration", "User Interface", "Universal Interface", "Unique Interaction"], answer: 1 },
      { q: "Which color model is primary for digital screen displays?", options: ["RGB", "CMYK", "Pantone", "HSB only"], answer: 0 },
      { q: "What is typography?", options: ["The style, arrangement, and appearance of text", "The layout of image maps", "User typing speed metrics", "None of the above"], answer: 0 },
      { q: "What is the primary purpose of user research?", options: ["To decide color themes", "To understand user needs, behaviors, and motivations", "To test server response speeds", "None of the above"], answer: 1 },
      { q: "What is a persona in UX design?", options: ["A real-world actual user", "A semi-fictional representation of a target user segment", "A software testing framework", "None of the above"], answer: 1 },
      { q: "What does visual hierarchy determine?", options: ["The order in which the eye perceives elements", "The loading order of script files", "The database index hierarchy", "None of the above"], answer: 0 },
      { q: "What is microcopy in UI design?", options: ["Very small fonts used in legal notices", "Short snippets of text that guide users through interfaces", "Metadata headers", "None of the above"], answer: 1 },
      { q: "What is a prototype?", options: ["A production-ready application", "An interactive mockup model of a design used for testing", "A vector design tool", "None of the above"], answer: 1 },
      { q: "What is the primary goal of accessibility (a11y)?", options: ["To make digital products usable for people with disabilities", "To speed up website loading", "To restrict public user registrations", "None of the above"], answer: 0 },
      { q: "Which design principle highlights that elements close to one another are perceived as related?", options: ["Similarity", "Proximity", "Continuity", "Closure"], answer: 1 },
      { q: "What is a design system?", options: ["A collection of reusable components and design guidelines", "A database modeling tool", "A graphic editing application", "None of the above"], answer: 0 },
      { q: "What does Fitts' Law predict?", options: ["The time required to move to a target is a function of target size and distance", "The color contrast ratio", "The user reading speed", "The bounce rate of users"], answer: 0 },
      { q: "What is a CTA in design?", options: ["Call to Action", "Client Target Area", "Color Transition Attribute", "None of the above"], answer: 0 },
      { q: "What is kerning in typography?", options: ["The spacing between lines of text", "The spacing between specific character pairs", "The vertical alignment", "None of the above"], answer: 1 },
      { q: "Which tool is standard for graphic drawing and layout editing?", options: ["Adobe Illustrator", "Notepad", "Command prompt", "PowerPoint"], answer: 0 },
      { q: "What is user testing?", options: ["Testing server loads with mock users", "Evaluating a product by testing it with real users", "Checking database constraints", "None of the above"], answer: 1 },
      { q: "What is information architecture (IA)?", options: ["The structural organization of information within an application", "The processor architecture", "The bandwidth capacity", "None of the above"], answer: 0 },
      { q: "What is white space (negative space)?", options: ["The empty space around design elements", "Wasted space that should be removed", "The color of the page background only", "None of the above"], answer: 0 },
      { q: "Which contrast ratio is recommended for standard body text by WCAG AA?", options: ["1.5:1", "3:1", "4.5:1", "10:1"], answer: 2 },
      { q: "What is a user flow?", options: ["The path taken by a prototypical user to complete a task", "The flow of data in APIs", "The database backup sequence", "None of the above"], answer: 0 },
      { q: "What is usability?", options: ["How easy and satisfying a product is to use", "How many features a product has", "How fast the code runs", "None of the above"], answer: 0 },
      { q: "Which font style does not have small decorative strokes at the end of characters?", options: ["Serif", "Sans-Serif", "Script", "Monospace"], answer: 1 },
      { q: "What does mobile-first design emphasize?", options: ["Designing for smaller mobile screens before scaling up to desktop", "Developing only mobile applications", "Buying mobile devices first", "None of the above"], answer: 0 },
      { q: "What is card sorting used for in UX?", options: ["Designing navigation and site taxonomy", "Sorting playing cards", "Testing payment processing gates", "None of the above"], answer: 0 },
      { q: "What is the primary color of a brand usually used for?", options: ["Background grids", "Key CTA buttons and highlighted states", "Body text", "Footer metadata lists"], answer: 1 },
      { q: "What is heuristic evaluation?", options: ["A review of an interface based on usability guidelines", "A database query optimization technique", "A system testing protocol", "None of the above"], answer: 0 }
    ],
    xpReward: 150
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms Check",
    duration: 300,
    questions: [
      { q: "What is the average time complexity of QuickSort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: 1 },
      { q: "Which data structure follows LIFO (Last In First Out)?", options: ["Queue", "Stack", "Tree", "Graph"], answer: 1 },
      { q: "Which sorting algorithm is stable by default?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"], answer: 0 },
      { q: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: 2 },
      { q: "Which data structure utilizes keys to map directly to values via index offsets?", options: ["Queue", "Stack", "Hash Table", "Linked List"], answer: 2 },
      { q: "What is the time complexity of adding a node at the beginning of a Singly Linked List?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: 0 },
      { q: "Which traversal prints a Binary Search Tree (BST) in sorted ascending order?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], answer: 1 },
      { q: "What does DFS stand for?", options: ["Double First Search", "Depth First Search", "Direct File System", "None of the above"], answer: 1 },
      { q: "Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?", options: ["Kruskal's", "Dijkstra's", "Prim's", "Bellman-Ford"], answer: 1 },
      { q: "What is the worst-case space complexity of recursion?", options: ["O(1)", "O(n) due to stack depth", "O(n^2)", "O(log n)"], answer: 1 },
      { q: "Which data structure handles FIFO (First In First Out)?", options: ["Stack", "Queue", "Binary Tree", "Heap"], answer: 1 },
      { q: "What is the binary search time complexity?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: 2 },
      { q: "Which algorithm finds the minimum spanning tree of a graph?", options: ["Kruskal's Algorithm", "Dijkstra's Algorithm", "Binary Search", "DFS"], answer: 0 },
      { q: "What is a collision in a hash table?", options: ["Two keys hashing to the same index", "A system crash", "Multiple keys deleted", "None of the above"], answer: 0 },
      { q: "What is the height of a balanced tree with N nodes?", options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"], answer: 1 },
      { q: "Which sorting algorithm is in-place and has worst-case O(n^2)?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"], answer: 1 },
      { q: "What is the space complexity of BFS on a graph?", options: ["O(1)", "O(V) where V is number of vertices", "O(V^2)", "O(E) only"], answer: 1 },
      { q: "Which traversal visits nodes level by level?", options: ["Pre-order", "Post-order", "Breadth First Search (BFS) / Level-order", "In-order"], answer: 2 },
      { q: "What is the key characteristic of a heap data structure?", options: ["Nodes are sorted left to right", "Parent node is always larger (Max-Heap) or smaller (Min-Heap) than child nodes", "Unique keys only", "None of the above"], answer: 1 },
      { q: "Which sort is the fastest in practice on average?", options: ["Selection Sort", "Quick Sort", "Bubble Sort", "Insertion Sort"], answer: 1 },
      { q: "What is a graph?", options: ["A collection of vertices connected by edges", "A chart showing user growth", "A tree with duplicate roots", "None of the above"], answer: 0 },
      { q: "What does dynamic programming do?", options: ["Loads code dynamically", "Solves problems by breaking them into overlapping subproblems and caching results", "Tests network systems", "None of the above"], answer: 1 },
      { q: "What is the space complexity of storing an adjacency matrix of a graph with V vertices?", options: ["O(V)", "O(V^2)", "O(V+E)", "O(E)"], answer: 1 },
      { q: "Which data structure works best for undo operations?", options: ["Queue", "Stack", "Graph", "Tree"], answer: 1 },
      { q: "Which tree traversal visits the root node last?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], answer: 2 },
      { q: "What does the term 'memoization' refer to?", options: ["Deleting memory records", "Caching function results to speed up execution", "Converting variables to strings", "None of the above"], answer: 1 },
      { q: "What is the maximum number of children a binary tree node can have?", options: ["1", "2", "3", "Unlimited"], answer: 1 },
      { q: "Which data structure consists of nodes where each node has a value and a pointer to the next node?", options: ["Array", "Linked List", "Stack", "Tree"], answer: 1 },
      { q: "What is the time complexity of accessing an array element by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: 0 },
      { q: "Which sorting algorithm splits an array in halves, sorts them recursively, and merges them?", options: ["Quick Sort", "Merge Sort", "Heap Sort", "Insertion Sort"], answer: 1 }
    ],
    xpReward: 250
  },
  {
    id: "node",
    title: "Node.js Essentials Check",
    duration: 300,
    questions: [
      { q: "Which module is used to handle file paths in Node.js?", options: ["fs", "path", "http", "os"], answer: 1 },
      { q: "Is Node.js single-threaded or multi-threaded by default?", options: ["Single-threaded", "Multi-threaded", "Depends on CPU cores", "None of the above"], answer: 0 },
      { q: "Which function import syntax is standard in ES6 Node.js?", options: ["require()", "import from", "include()", "using()"], answer: 1 },
      { q: "What is the command to initialize a new Node.js project?", options: ["npm init", "npm install", "node start", "node init"], answer: 0 },
      { q: "What library parses environment variables in Node.js?", options: ["express", "dotenv", "path", "fs"], answer: 1 },
      { q: "Which core module enables launching HTTP servers?", options: ["url", "http", "net", "stream"], answer: 1 },
      { q: "What does npm stand for?", options: ["Node Package Manager", "New Project Method", "Network Protocol Mapping", "None of the above"], answer: 0 },
      { q: "Which method in the fs module reads a file synchronously?", options: ["fs.readFile()", "fs.readFileSync()", "fs.read()", "fs.getFile()"], answer: 1 },
      { q: "What is the event loop in Node.js?", options: ["A thread manager", "The engine mechanism that coordinates asynchronous non-blocking operations", "A recursive server route", "None of the above"], answer: 1 },
      { q: "Which keyword exports modules in CommonJS?", options: ["export default", "module.exports", "export const", "require.export"], answer: 1 },
      { q: "How do you install dependencies using npm?", options: ["npm install package_name", "npm get package_name", "node get package_name", "npm add package_name"], answer: 0 },
      { q: "Which method schedules a callback to run immediately after the current poll phase completes?", options: ["setTimeout", "setInterval", "setImmediate", "process.nextTick"], answer: 2 },
      { q: "What does process.env contain?", options: ["Node system settings", "Environment variables", "Active process IDs", "None of the above"], answer: 1 },
      { q: "Which framework is most popular for building APIs in Node.js?", options: ["React", "Express.js", "Django", "Spring Boot"], answer: 1 },
      { q: "What is REPL in Node.js?", options: ["Read-Eval-Print Loop", "Realtime Execution Port Link", "Route Event Processor Library", "None of the above"], answer: 0 },
      { q: "How do you run a JS file using Node.js in terminal?", options: ["run index.js", "node index.js", "npm index.js", "exec index.js"], answer: 1 },
      { q: "What does process.nextTick() do?", options: ["Schedules callback at the start of the next turn of the event loop", "Schedules callback after timers", "Waits for network responses", "None of the above"], answer: 0 },
      { q: "Which class represents raw binary data allocations in Node.js?", options: ["String", "Buffer", "Stream", "Binary"], answer: 1 },
      { q: "What is package.json used for?", options: ["To store project configurations and dependencies list", "To compile JS code", "To write server logic", "None of the above"], answer: 0 },
      { q: "Which method ends the server response in Node.js HTTP?", options: ["res.close()", "res.end()", "res.send()", "res.stop()"], answer: 1 },
      { q: "What is the name of Node's core C++ library that handles the event loop and async tasks?", options: ["V8", "libuv", "Tomcat", "Nginx"], answer: 1 },
      { q: "What are streams in Node.js?", options: ["An array of file bytes", "Objects that let you read data from a source or write data to a destination continuously", "Database queries", "None of the above"], answer: 1 },
      { q: "Which stream type is write-only?", options: ["Readable", "Writable", "Duplex", "Transform"], answer: 1 },
      { q: "How to capture unhandled exceptions in Node.js?", options: ["process.on('uncaughtException')", "window.onerror", "try-catch on every function", "None of the above"], answer: 0 },
      { q: "What does the node_modules folder contain?", options: ["Project source code", "Third-party dependency packages installed via npm", "System config files", "None of the above"], answer: 1 },
      { q: "Which API method registers callback events in EventEmitter?", options: ["on()", "emit()", "trigger()", "fire()"], answer: 0 },
      { q: "Which core module provides utilities for operating system information?", options: ["fs", "path", "os", "util"], answer: 2 },
      { q: "What is event-driven programming?", options: ["Programming based on time intervals", "A paradigm where execution flow is determined by events (user actions, messages, etc.)", "Object-oriented code execution", "None of the above"], answer: 1 },
      { q: "What is the purpose of package-lock.json?", options: ["To lock files from editing", "To lock exact versions of installed dependency packages", "To encrypt API keys", "None of the above"], answer: 1 },
      { q: "Which method imports a module in CommonJS?", options: ["require()", "import from", "using()", "load()"], answer: 0 }
    ],
    xpReward: 200
  },
  {
    id: "system",
    title: "System Design Basics Check",
    duration: 300,
    questions: [
      { q: "Which component routes traffic to servers?", options: ["CDN", "Database", "Load Balancer", "Cache"], answer: 2 },
      { q: "What does CDN stand for?", options: ["Content Delivery Network", "Central Data Node", "Client Device Network", "None of the above"], answer: 0 },
      { q: "What is horizontal scaling?", options: ["Adding more RAM to a server", "Adding more servers to the pool", "Optimizing code execution", "Scaling database tables"], answer: 1 },
      { q: "What is latency?", options: ["The bandwidth capacity", "The time taken for a packet to travel from source to destination", "The total server memory size", "None of the above"], answer: 1 },
      { q: "Which database system is best suited for structured SQL tables?", options: ["MongoDB", "MySQL", "Redis", "Cassandra"], answer: 1 },
      { q: "What is vertical scaling?", options: ["Adding more resource power (CPU/RAM) to an existing single server", "Adding more servers to the cluster", "Splitting database tables", "None of the above"], answer: 0 },
      { q: "What is caching in system architecture?", options: ["Storing data temporarily in high-speed memory for fast retrieval", "Encrypting database backups", "Compiling system configurations", "None of the above"], answer: 0 },
      { q: "Which caching engine is in-memory and extremely popular?", options: ["PostgreSQL", "Redis", "Elasticsearch", "H2"], answer: 1 },
      { q: "What is the CAP Theorem?", options: ["A networking protocol", "A theorem stating a distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance", "A security standard", "None of the above"], answer: 1 },
      { q: "What does DNS stand for?", options: ["Domain Name System", "Dynamic Node Server", "Data Network Service", "None of the above"], answer: 0 },
      { q: "What is database sharding?", options: ["Replicating database servers for HA", "Splitting database records horizontally across multiple database servers", "Converting SQL to NoSQL", "None of the above"], answer: 1 },
      { q: "What is a single point of failure (SPOF)?", options: ["An application bug", "A component in a system whose failure stops the entire system from working", "A database constraint failure", "None of the above"], answer: 1 },
      { q: "Which load balancing algorithm distributes requests in cyclical order?", options: ["Least Connections", "Round Robin", "IP Hash", "Random"], answer: 1 },
      { q: "What does high availability (HA) mean?", options: ["A system designed to operate continuously without failure for a long time", "A high processor speed", "A expensive server cost", "None of the above"], answer: 0 },
      { q: "What does stateless mean in web servers?", options: ["Server stores no session data from request to request", "Server has no database connections", "Server is currently offline", "None of the above"], answer: 0 },
      { q: "Which protocol is standard for secure web browser communications?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], answer: 1 },
      { q: "What is a message queue used for?", options: ["Asynchronous communication between services", "Storing application code logs", "Structuring SQL tables", "None of the above"], answer: 0 },
      { q: "Which tool is commonly used as a distributed message broker?", options: ["MySQL", "Apache Kafka", "Redis cache only", "Docker"], answer: 1 },
      { q: "What is database replication?", options: ["Copying database records to multiple server nodes for redundancy and read scaling", "Deleting database backups", "Converting schemas", "None of the above"], answer: 0 },
      { q: "What does microservices architecture describe?", options: ["An application structured as a collection of loosely coupled, deployable services", "A single massive monolithic codebase", "Using small computers only", "None of the above"], answer: 0 },
      { q: "What does a reverse proxy do?", options: ["Retrieves resources on behalf of a client from one or more servers", "Retrieves client data on behalf of servers", "Encrypts database passwords", "None of the above"], answer: 0 },
      { q: "What is rate limiting?", options: ["Limiting user download speeds", "Limiting the rate of network requests from a client to prevent resource exhaustion", "Limiting database size", "None of the above"], answer: 1 },
      { q: "Which component stores index maps for fast text searches?", options: ["MySQL", "Elasticsearch", "Redis", "S3"], answer: 1 },
      { q: "What is the primary benefit of a Monolithic architecture?", options: ["Simpler deployment and development in initial stages", "Highly complex structure", "Scales independently automatically", "None of the above"], answer: 0 },
      { q: "What does auto-scaling accomplish?", options: ["Resizes database tables", "Dynamically adjusts the number of active server instances based on load", "Compiles code", "None of the above"], answer: 1 },
      { q: "What is the function of an API Gateway?", options: ["Routes API traffic, handles auth, rate-limiting, and telemetry aggregation", "Acts as primary database", "Compiles microservice components", "None of the above"], answer: 0 },
      { q: "What is a distributed system?", options: ["A system running on multiple autonomous computers communicating over a network", "A system with many files", "A system for distributing flyers", "None of the above"], answer: 0 },
      { q: "What is read-through cache?", options: ["Caching strategy where the cache updates itself from the DB when a cache miss occurs", "Writing to DB directly first", "Reading directly from DB only", "None of the above"], answer: 0 },
      { q: "Which service stores unstructured blobs and objects in AWS?", options: ["RDS", "S3", "EC2", "DynamoDB"], answer: 1 },
      { q: "What is load testing?", options: ["Testing code compile speeds", "Testing system performance under heavy load simulation", "Testing database tables size", "None of the above"], answer: 1 }
    ],
    xpReward: 250
  },
  {
    id: "ml",
    title: "Machine Learning Check",
    duration: 300,
    questions: [
      { q: "Which metric measures regression accuracy?", options: ["Precision", "F1 Score", "Mean Squared Error (MSE)", "Recall"], answer: 2 },
      { q: "Which algorithm is commonly used for classification tasks?", options: ["Linear Regression", "Logistic Regression", "K-Means Clustering", "Apriori"], answer: 1 },
      { q: "What is overfitting in machine learning?", options: ["Model performs well on training data but poorly on unseen data", "Model performs poorly on all data", "Model runs too slowly", "None of the above"], answer: 0 },
      { q: "What is supervised learning?", options: ["Learning with labeled training data", "Learning with unlabeled data", "Self-supervised game learning", "None of the above"], answer: 0 },
      { q: "What is unsupervised learning?", options: ["Learning with labeled data", "Learning with unlabeled data to find hidden patterns", "Manual parameter tuning", "None of the above"], answer: 1 },
      { q: "Which algorithm is used for clustering datasets?", options: ["Linear Regression", "K-Means", "Support Vector Machines", "Decision Trees"], answer: 1 },
      { q: "What does a confusion matrix show?", options: ["Model execution time log", "The classification performance table (True/False Positives/Negatives)", "System resource utilization", "None of the above"], answer: 1 },
      { q: "What is the function of an activation function in neural networks?", options: ["Activates the database connection", "Introduces non-linearity to the network model", "Saves model weights to files", "None of the above"], answer: 1 },
      { q: "Which activation function is most popular for hidden layers?", options: ["Sigmoid", "Tanh", "ReLU (Rectified Linear Unit)", "Softmax"], answer: 2 },
      { q: "What is gradient descent?", options: ["An optimization algorithm used to minimize cost function", "A classification algorithm", "A dataset splitting method", "None of the above"], answer: 0 },
      { q: "What does F1 score represent?", options: ["The harmonic mean of precision and recall", "The highest accuracy value", "The training speed index", "None of the above"], answer: 0 },
      { q: "What is a random forest in ML?", options: ["An ensemble learning method using multiple decision trees", "A dataset generation tool", "A cloud server cluster", "None of the above"], answer: 0 },
      { q: "What is bias in machine learning?", options: ["The error from erroneous assumptions in the learning algorithm (underfitting)", "The variance of model weights", "A secure key", "None of the above"], answer: 0 },
      { q: "What is variance in machine learning?", options: ["Model's sensitivity to small fluctuations in the training set (overfitting)", "The error from bias assumptions", "The dataset size difference", "None of the above"], answer: 0 },
      { q: "Which validation technique splits data into K subsets iteratively?", options: ["Holdout validation", "K-Fold Cross-Validation", "Train-Test split only", "None of the above"], answer: 1 },
      { q: "What does SVM stand for?", options: ["Support Vector Machine", "Super Vector Model", "System Validation Method", "None of the above"], answer: 0 },
      { q: "What is a hyperparameter?", options: ["A parameter whose value is set before the learning process begins", "A parameter learned during training", "A database index", "None of the above"], answer: 0 },
      { q: "Which algorithm is a simple instance-based learning algorithm that classifies based on neighbors?", options: ["K-Nearest Neighbors (KNN)", "Linear Regression", "K-Means", "Naive Bayes"], answer: 0 },
      { q: "What is the purpose of regularization (L1/L2)?", options: ["To prevent overfitting by penalizing large weights", "To speed up server responses", "To clean up dataset variables", "None of the above"], answer: 0 },
      { q: "Which library is standard for data manipulation in Python?", options: ["NumPy", "Pandas", "Scikit-Learn", "Matplotlib"], answer: 1 },
      { q: "Which library is standard for scientific computing and matrix calculations?", options: ["Pandas", "NumPy", "Seaborn", "TensorFlow only"], answer: 1 },
      { q: "What is deep learning?", options: ["Machine learning using deep neural networks with multiple layers", "Learning with advanced books", "Unsupervised clustering only", "None of the above"], answer: 0 },
      { q: "What does NLP stand for in ML?", options: ["Natural Language Processing", "Network Link Protocol", "Node Language Parsing", "None of the above"], answer: 0 },
      { q: "Which of the following is a reinforcement learning concept?", options: ["Agent and Environment", "Policy and Reward", "Action and State", "All of the above"], answer: 3 },
      { q: "What does PCA stand for in dimensionality reduction?", options: ["Principal Component Analysis", "Primary Correlation Assessment", "Predictive Cluster Analysis", "None of the above"], answer: 0 },
      { q: "Which neural network architecture is best suited for image processing?", options: ["RNN", "CNN (Convolutional Neural Network)", "Transformer", "Monolith"], answer: 1 },
      { q: "Which architecture is best suited for sequential text processing (translation)?", options: ["CNN", "Transformer / RNN", "K-Means", "SVM"], answer: 1 },
      { q: "What is the standard train-test split ratio commonly used?", options: ["50/50", "80/20 or 70/30", "99/1", "10/90"], answer: 1 },
      { q: "What does MSE stand for in regression?", options: ["Mean Squared Error", "Median Standard Error", "Model System Evaluation", "None of the above"], answer: 0 },
      { q: "Which framework is developed by Google for deep learning?", options: ["PyTorch", "TensorFlow", "Scikit-Learn", "Django"], answer: 1 }
    ],
    xpReward: 250
  }
];

import AppLogo from "../components/AppLogo";

export default function AssessmentsPage() {
  const { user, xp, logout, themeMode, toggleTheme, earnXp } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  // Timer Effect
  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !quizFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (activeQuiz && timeLeft === 0 && !quizFinished) {
      submitQuiz();
    }
  }, [activeQuiz, timeLeft, quizFinished]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.duration);
    setQuizFinished(false);
    setScore(0);
  };

  const selectAnswer = (ansIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: ansIdx
    }));
  };

  const submitQuiz = () => {
    let calculatedScore = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setQuizFinished(true);

    // If passed (more than 50% correct), reward XP
    const passed = calculatedScore >= activeQuiz.questions.length / 2;
    if (passed && earnXp) {
      earnXp(activeQuiz.xpReward);
      const passedList = JSON.parse(localStorage.getItem(`skillsphere_assessments_passed_${user?.email || "guest"}`) || "[]");
      if (!passedList.includes(activeQuiz.id)) {
        passedList.push(activeQuiz.id);
        localStorage.setItem(`skillsphere_assessments_passed_${user?.email || "guest"}`, JSON.stringify(passedList));
      }
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "student-profile", label: "Student Profile", icon: <FaAward /> },
    { id: "services-catalog", label: "Services & Catalog", icon: <FaBook /> },
    { id: "assessments", label: "Assessments", icon: <FaBolt /> },
    { id: "certification-tracking", label: "Cert Tracking", icon: <FaCertificate /> },
    
    { id: "complaint-tracking", label: "Complaint & Renewal", icon: <FaFileInvoice /> },
    { id: "career-roadmap", label: "Career Roadmap", icon: <FaCodeBranch /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "learning-paths", label: "Learning Paths", icon: <FaCodeBranch /> },
    { id: "ai-buddy", label: "AI Study Buddy", icon: <FaRobot /> },
    { id: "opportunity-feed", label: "Opportunity Feed", icon: <FaRocket /> },
    { id: "daily-quests", label: "Daily Quests", icon: <FaBolt /> },
    { id: "badges", label: "Badges", icon: <FaAward /> },
    { id: "certificates", label: "Certificates", icon: <FaCertificate /> },
    { id: "progress", label: "Progress", icon: <FaChartLine /> },
    { id: "resume", label: "Resume Builder", icon: <FaFileInvoice /> },
    { id: "code-arena", label: "CodeArena", icon: <FaCode /> }
  ];

  return (
    <div className={`sdDashboardWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      <div className="sdMainContainer">
        {/* Left Sidebar */}
        <aside className="sdLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>
            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button className="sdHomeCircularBtn" onClick={() => navigate("/student-home")}>
                <FaHome />
              </button>
            </div>
            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "assessments" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "student-profile") navigate("/student-profile");
                      else if (item.id === "services-catalog") navigate("/services-catalog");
                      else if (item.id === "assessments") navigate("/assessments");
                      else if (item.id === "certification-tracking") navigate("/certification-tracking");
                      
                      else if (item.id === "complaint-tracking") navigate("/complaint-tracking");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "job-search") navigate("/job-search");
                      else navigate(`/${item.id}`);
                    }}
                  >
                    <span className="navIcon">{item.icon}</span>
                    <span className="navLabel">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="sdSidebarBottomSection">
            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn" onClick={() => navigate(-1)}>
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="sdRightBodyArea">
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input type="text" className="sdSearchInput" placeholder="Search assessments..." />
            </div>
            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{xp ?? 0} XP</span>
              </div>
              <NotificationDropdown type="student" />
              <button className="sdLogoutHeaderBtn" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill">
                  <UserAvatar user={user} />
                  <div className="sdUserInfoText">
                    <strong>{user?.full_name || "Learner"}</strong>
                    <span>Student</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="sdGreetingHeader">
            <h1>Skill Assessments</h1>
            <p>Prove your technical expertise and earn high bonus XP rewards.</p>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: Assessment execution or selection */}
            <div className="sdCenterMainCol">
              {!activeQuiz ? (
                <div className="sdWhitePanelCard">
                  <h3>Available Skill Assessments</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
                    {ASSESSMENTS_LIST.map((quiz) => {
                      const completedList = JSON.parse(localStorage.getItem(`skillsphere_assessments_passed_${user?.email || "guest"}`) || "[]");
                      const isCompleted = completedList.includes(quiz.id);
                      return (
                        <div key={quiz.id} style={{ padding: "20px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <span style={{ fontSize: "12px", background: "var(--border-color)", padding: "2px 8px", borderRadius: "10px", color: "var(--text-secondary)" }}>
                                ⏱️ {quiz.duration}s Limit
                              </span>
                              {isCompleted && <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "bold" }}>Completed ✓</span>}
                            </div>
                            <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>{quiz.title}</h4>
                             <p style={{ margin: "0 0 16px 0", color: "var(--text-secondary)", fontSize: "13px" }}>
                              Test your knowledge on {
                                quiz.id === "js" ? "JavaScript V8 engine, closures and event scopes." :
                                quiz.id === "react" ? "React functional components, custom hooks, and state lifecycles." :
                                quiz.id === "python" ? "Python variables, immutable data structures, lists, and loops." :
                                quiz.id === "uiux" ? "UI/UX principles, design systems, visual hierarchy, and wireframes." :
                                quiz.id === "dsa" ? "Data structures, sorting algorithms, arrays, lists, and time complexity." :
                                quiz.id === "node" ? "Node.js non-blocking I/O, file systems, events, and HTTP servers." :
                                quiz.id === "system" ? "System design concepts, load balancers, caching, and CDN routing." :
                                "Machine Learning algorithms, regression metrics, and dataset split validation."
                              }
                            </p>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "14px" }}>+{quiz.xpReward} XP</span>
                            <button className="btnContinueCourse" onClick={() => startQuiz(quiz)}>
                              {isCompleted ? "Retake Exam" : "Start Test"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="sdWhitePanelCard" style={{ padding: "30px" }}>
                  {!quizFinished ? (
                    <div>
                      {/* Quiz Interface */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "20px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-primary)" }}>{activeQuiz.title}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: timeLeft <= 10 ? "#ef4444" : "var(--accent)" }}>
                          <FaClock /> <strong>{timeLeft}s remaining</strong>
                        </div>
                      </div>

                      <div style={{ marginBottom: "24px" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                          Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                        </span>
                        <h4 style={{ color: "var(--text-primary)", fontSize: "18px", margin: 0, lineHeight: "1.5" }}>
                          {activeQuiz.questions[currentQuestionIdx].q}
                        </h4>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
                        {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                          const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => selectAnswer(idx)}
                              style={{
                                width: "100%",
                                padding: "16px",
                                textAlign: "left",
                                background: isSelected ? "var(--btn-primary-bg)" : "var(--bg-secondary)",
                                color: isSelected ? "var(--btn-primary-text)" : "var(--text-primary)",
                                border: isSelected ? "none" : "1px solid var(--border-color)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: isSelected ? "bold" : "normal",
                                transition: "all 0.2s"
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button
                          disabled={currentQuestionIdx === 0}
                          onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                          style={{
                            padding: "10px 20px",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "8px",
                            cursor: "pointer"
                          }}
                        >
                          Previous
                        </button>

                        {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                            style={{
                              padding: "10px 20px",
                              background: "var(--accent)",
                              color: "black",
                              border: "none",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              cursor: "pointer"
                            }}
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            onClick={submitQuiz}
                            style={{
                              padding: "10px 24px",
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              cursor: "pointer"
                            }}
                          >
                            Finish & Submit
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Quiz Results */
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <span style={{ fontSize: "64px" }}>
                        {score >= activeQuiz.questions.length / 2 ? "🎉" : "😢"}
                      </span>
                      <h3 style={{ color: "var(--text-primary)", margin: "20px 0 8px 0" }}>
                        {score >= activeQuiz.questions.length / 2 ? "Congratulations! You Passed!" : "Test Failed. Try Again!"}
                      </h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 20px 0" }}>
                        You scored {score} out of {activeQuiz.questions.length} questions correctly.
                      </p>
                      
                      {score >= activeQuiz.questions.length / 2 ? (
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px", color: "#10b981", fontWeight: "bold", marginBottom: "24px" }}>
                          <FaCheckCircle /> <span>Earned +{activeQuiz.xpReward} XP!</span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px", color: "#ef4444", fontWeight: "bold", marginBottom: "24px" }}>
                          <FaExclamationCircle /> <span>{"Score must be >= 50% to pass."}</span>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                        <button className="btnOutlineOrange" onClick={() => startQuiz(activeQuiz)}>Retake Quiz</button>
                        <button className="btnContinueCourse" onClick={() => setActiveQuiz(null)}>Back to Selection</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: High scores */}
            <div className="sdRightColumnSidebar">
              <div className="sdRightWidgetCard">
                <h4>Quiz Highscores</h4>
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>1. Alex Morgan (You)</span>
                    <strong style={{ color: "var(--text-primary)" }}>100%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>2. Soumitri Roy</span>
                    <strong style={{ color: "var(--text-primary)" }}>100%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>3. Aarav Sharma</span>
                    <strong style={{ color: "var(--text-primary)" }}>66%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
}
