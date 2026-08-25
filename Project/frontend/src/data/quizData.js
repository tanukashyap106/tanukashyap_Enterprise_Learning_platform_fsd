// SkillSphere Course Quiz Dataset - 20 Questions per Course Track
// References: GeeksforGeeks (GFG) & W3Schools Documentation

export const react20QuizQuestions = [
  {
    id: 1,
    q: "What is the primary purpose of React JSX?",
    options: ["Write HTML-like syntax inside JavaScript", "Directly compile CSS stylesheets", "Execute SQL database queries in the browser", "Replace Node.js runtime engines"],
    correct: 0,
    ref: "W3Schools: React JSX Guide",
    explanation: "JSX allows writing HTML-like tags in JavaScript which React converts into React.createElement() calls."
  },
  {
    id: 2,
    q: "Which hook is used to handle side effects in React functional components?",
    options: ["useState()", "useEffect()", "useContext()", "useReducer()"],
    correct: 1,
    ref: "GeeksforGeeks: ReactJS useEffect Hook",
    explanation: "useEffect handles side effects such as data fetching, subscriptions, and manual DOM updates."
  },
  {
    id: 3,
    q: "How do you pass data from a parent component to a child component in React?",
    options: ["Via Props", "Via localStorage", "Via Redux reducers only", "Via HTTP POST requests"],
    correct: 0,
    ref: "W3Schools: React Props",
    explanation: "Props (short for properties) are read-only inputs passed from parent components to child components."
  },
  {
    id: 4,
    q: "What is the Virtual DOM in React?",
    options: ["A lightweight in-memory representation of the real DOM", "A database table inside Google Chrome", "A physical CPU hardware chip", "An alternative to HTML5 tags"],
    correct: 0,
    ref: "GeeksforGeeks: ReactJS Virtual DOM",
    explanation: "React maintains a Virtual DOM in memory and diffs it with previous state to optimize DOM updates."
  },
  {
    id: 5,
    q: "What is the correct way to update state using useState in React?",
    options: ["Direct mutation: state = newValue", "Call updater function: setScore(newValue)", "Call window.location.reload()", "Modify document.getElementById().value"],
    correct: 1,
    ref: "W3Schools: React useState Hook",
    explanation: "Calling the updater function returned by useState schedules a re-render and updates state immutably."
  },
  {
    id: 6,
    q: "Which rule MUST be followed when calling React Hooks?",
    options: ["Call hooks inside loops and conditional if blocks", "Call hooks only at the top level of functional components", "Call hooks inside class constructors only", "Call hooks inside utility helper files"],
    correct: 1,
    ref: "GeeksforGeeks: Rules of Hooks in React",
    explanation: "Hooks must be called at the top level to guarantee that Hooks are called in the exact same order on every render."
  },
  {
    id: 7,
    q: "What is the primary function of the 'key' prop when rendering lists in React?",
    options: ["Helps React identify which list items have changed, added, or removed", "Styles list items with dynamic background colors", "Encrypts list item data in local storage", "Automatically sorts list items alphabetically"],
    correct: 0,
    ref: "W3Schools: React Keys & Lists",
    explanation: "Keys give list elements a stable identity so React can efficiently re-render changed elements."
  },
  {
    id: 8,
    q: "What is the role of the useMemo hook in React performance optimization?",
    options: ["Memoizes the result of an expensive calculation between re-renders", "Sends HTTP GET requests to external APIs", "Stores component state inside browser memory cache", "Defines dynamic route parameters"],
    correct: 0,
    ref: "GeeksforGeeks: React useMemo Hook",
    explanation: "useMemo caches calculated values and only recalculates when one of its dependencies changes."
  },
  {
    id: 9,
    q: "How does React Context API solve the problem of Prop Drilling?",
    options: ["Shares global state directly down component tree without passing props manually", "Compiles React code into WebAssembly binaries", "Converts class components to functional components", "Connects React directly to MongoDB"],
    correct: 0,
    ref: "W3Schools: React useContext Hook",
    explanation: "Context provides a way to share state like user authentication or theme across components without prop drilling."
  },
  {
    id: 10,
    q: "In JavaScript, what is a Closure?",
    options: ["A function bundled together with references to its outer scope environment", "A browser button that closes the active window", "A statement that breaks out of a while loop", "A private CSS variable definition"],
    correct: 0,
    ref: "GeeksforGeeks: JavaScript Closures",
    explanation: "Closures give functions access to variables in their parent scope even after the parent function has executed."
  },
  {
    id: 11,
    q: "What does the JavaScript Event Loop monitor?",
    options: ["Monitors Call Stack and Microtask Queue to push async callbacks onto Call Stack", "Renders CSS flexbox elements on screen", "Compiles Java code into bytecode", "Manages SQL database connection pools"],
    correct: 0,
    ref: "GeeksforGeeks: JavaScript Event Loop",
    explanation: "The Event Loop continuously checks if Call Stack is empty, pushing tasks from Microtask and Callback queues."
  },
  {
    id: 12,
    q: "Which ES6 feature unpacks values from arrays or properties from objects into distinct variables?",
    options: ["Destructuring Assignment", "Array Splice", "Prototype Inheritance", "CommonJS Exports"],
    correct: 0,
    ref: "W3Schools: ES6 Destructuring",
    explanation: "Destructuring syntax unpacks object properties or array items cleanly into local variables."
  },
  {
    id: 13,
    q: "What is the key difference between call(), apply(), and bind() in JavaScript?",
    options: ["call() & apply() invoke function immediately; bind() returns a new function", "bind() deletes object properties from memory", "apply() only works on string parameters", "call() is used exclusively in Node.js"],
    correct: 0,
    ref: "GeeksforGeeks: call(), apply() vs bind()",
    explanation: "call() takes args individually, apply() takes an array of args, and bind() returns a new function."
  },
  {
    id: 14,
    q: "What makes Node.js architecture non-blocking and asynchronous?",
    options: ["Offloads I/O tasks to background libuv thread pool while Event Loop remains free", "Stops main thread until all file reads finish", "Spawns physical C++ GUI windows for each request", "Executes synchronous queries only"],
    correct: 0,
    ref: "GeeksforGeeks: Node.js Architecture & Libuv",
    explanation: "Node.js uses an event-driven non-blocking I/O model backed by libuv to handle thousands of concurrent connections."
  },
  {
    id: 15,
    q: "What is Express.js Middleware?",
    options: ["Functions that have access to req, res objects and next() in HTTP cycle", "A database ORM for MySQL", "A CSS frontend UI library", "A Chrome browser extension"],
    correct: 0,
    ref: "W3Schools: Node.js Express Middleware",
    explanation: "Middleware functions process incoming HTTP requests, modify req/res objects, or trigger error handling."
  },
  {
    id: 16,
    q: "In Mongoose, what is a Schema?",
    options: ["A document structure blueprint defining field types, defaults, and validators for MongoDB", "A SQL JOIN query string", "A CSS layout grid", "A web router table"],
    correct: 0,
    ref: "GeeksforGeeks: Mongoose Schema & Models",
    explanation: "Mongoose schemas define shape, data types, and validation rules for documents stored in MongoDB collections."
  },
  {
    id: 17,
    q: "What does React.memo HOC accomplish?",
    options: ["Skips re-rendering a component if its incoming props are unchanged", "Stores component state in browser IndexedDB", "Forces full browser window reloads", "Converts JSX into HTML string"],
    correct: 0,
    ref: "GeeksforGeeks: React.memo Performance",
    explanation: "React.memo is a higher-order component that memoizes functional component render outputs based on prop equality."
  },
  {
    id: 18,
    q: "Why do Single Page Applications (SPAs) use Client-Side Routing?",
    options: ["Updates URL and renders view components dynamically without reloading HTML page", "Reloads complete HTML files from server on every click", "Clears localStorage data on navigation", "Prevents users from clicking back buttons"],
    correct: 0,
    ref: "W3Schools: React Router SPAs",
    explanation: "Client-side routing swaps components in the DOM dynamically, providing fast seamless navigation without page reloads."
  },
  {
    id: 19,
    q: "What does the useRef hook return in React?",
    options: ["A mutable object with a .current property that persists across component re-renders", "A state variable and state setter pair", "A JavaScript Promise", "An array of DOM nodes"],
    correct: 0,
    ref: "GeeksforGeeks: React useRef Hook",
    explanation: "useRef returns a mutable object whose .current property holds a reference to a DOM node or persistent value without triggering re-renders."
  },
  {
    id: 20,
    q: "What is the primary role of Redux Toolkit Slices?",
    options: ["Bundles state, reducer logic, and action creators for a specific feature module", "Styles React buttons with CSS tokens", "Handles server SQL migrations", "Compresses image files before submission"],
    correct: 0,
    ref: "GeeksforGeeks: Redux Toolkit Slices",
    explanation: "A slice in Redux Toolkit defines the initial state, reducer functions, and auto-generates corresponding action creators."
  }
];

export const python20QuizQuestions = [
  {
    id: 1,
    q: "What is the main difference between a Python List and a Tuple?",
    options: ["Lists are mutable (modifiable); Tuples are immutable (cannot be changed)", "Tuples can store string values while lists cannot", "Lists use curly braces {}; Tuples use no brackets", "Lists execute slower than SQL queries"],
    correct: 0,
    ref: "GeeksforGeeks: Python List vs Tuple",
    explanation: "Lists can be modified after creation, whereas tuples are immutable and memory-efficient."
  },
  {
    id: 2,
    q: "Which Python library is primarily used for high-performance N-dimensional array processing?",
    options: ["NumPy", "Matplotlib", "Flask", "BeautifulSoup"],
    correct: 0,
    ref: "W3Schools: Python NumPy Tutorial",
    explanation: "NumPy provides ndarray data structures for fast vectorized mathematical operations."
  },
  {
    id: 3,
    q: "In Pandas, what is a DataFrame?",
    options: ["A 2-dimensional labeled data structure with columns of potentially different types", "A 3D graphics rendering window", "A file compression algorithm", "A network routing protocol"],
    correct: 0,
    ref: "W3Schools: Pandas DataFrames",
    explanation: "A DataFrame is a 2D tabular data structure like a spreadsheet or SQL table."
  },
  {
    id: 4,
    q: "Which statement is used for exception handling in Python?",
    options: ["try ... except ... finally", "do ... catch", "begin ... rescue", "switch ... case"],
    correct: 0,
    ref: "GeeksforGeeks: Python Exception Handling",
    explanation: "Python handles runtime errors using try-except blocks."
  },
  {
    id: 5,
    q: "What is a List Comprehension in Python?",
    options: ["A concise syntax to create lists based on existing iterables: [x*2 for x in nums]", "A method to delete lists from RAM", "A mechanism to encrypt strings", "A multi-threading process"],
    correct: 0,
    ref: "W3Schools: Python List Comprehension",
    explanation: "List comprehension offers a shorter syntax when you want to create a new list based on existing values."
  },
  {
    id: 6,
    q: "What does the 'self' keyword represent inside a Python class method?",
    options: ["Refers to the instance of the class currently executing the method", "Refers to the parent module file", "A global system variable", "A keyword to delete attributes"],
    correct: 0,
    ref: "GeeksforGeeks: self in Python class",
    explanation: "'self' accesses variables and attributes belonging to the specific class instance."
  },
  {
    id: 7,
    q: "Which Scikit-Learn class is used to split datasets into training and testing subsets?",
    options: ["train_test_split", "data_divider", "sample_split", "subset_generator"],
    correct: 0,
    ref: "GeeksforGeeks: Scikit-Learn train_test_split",
    explanation: "train_test_split randomly divides features and labels into training and evaluation sets."
  },
  {
    id: 8,
    q: "What does the __init__ method do in Python Object Oriented Programming?",
    options: ["Serves as constructor method to initialize object state attributes upon creation", "Destroys instance from memory", "Imports external modules", "Compiles code to C"],
    correct: 0,
    ref: "W3Schools: Python __init__ Function",
    explanation: "__init__ is automatically called when a new instance of a class is instantiated."
  },
  {
    id: 9,
    q: "What is the time complexity of looking up a key in a Python Dictionary?",
    options: ["O(1) average time complexity", "O(N^2)", "O(N log N)", "O(N) linear time"],
    correct: 0,
    ref: "GeeksforGeeks: Time Complexity of Python Data Structures",
    explanation: "Python dictionaries use hash tables, offering average O(1) time complexity for key lookups."
  },
  {
    id: 10,
    q: "Which library is widely used for data visualization and plotting in Python?",
    options: ["Matplotlib", "Django", "SQLAlchemy", "Requests"],
    correct: 0,
    ref: "W3Schools: Matplotlib Intro",
    explanation: "Matplotlib is the foundational visualization library for creating static, animated, and interactive plots in Python."
  },
  {
    id: 11,
    q: "What is the difference between shallow copy and deep copy in Python copy module?",
    options: ["Shallow copy constructs a new object but inserts references; Deep copy recursively copies child objects", "Shallow copy converts objects to strings", "Deep copy is only for integers", "There is no difference"],
    correct: 0,
    ref: "GeeksforGeeks: Shallow vs Deep Copy in Python",
    explanation: "copy.copy() creates a shallow copy, while copy.deepcopy() recursively duplicates all nested objects."
  },
  {
    id: 12,
    q: "What is a Python Generator function?",
    options: ["A function that uses the yield statement to return a lazy iterator one item at a time", "A generator that generates random numbers", "A class compiler", "A database engine"],
    correct: 0,
    ref: "GeeksforGeeks: Python Generators",
    explanation: "Generators yield values on demand without storing the entire sequence in memory at once."
  },
  {
    id: 13,
    q: "Which builtin function returns both index and value while iterating over a list?",
    options: ["enumerate()", "zip()", "range()", "map()"],
    correct: 0,
    ref: "W3Schools: Python enumerate() Function",
    explanation: "enumerate() adds a counter to an iterable and returns it as an enumerate object yielding tuples of (index, item)."
  },
  {
    id: 14,
    q: "What is GIL (Global Interpreter Lock) in CPython?",
    options: ["A mutex mechanism that allows only one native thread to execute Python bytecode at a time", "A security firewall for web apps", "A database lock for SQLite", "A memory garbage collector"],
    correct: 0,
    ref: "GeeksforGeeks: What is GIL in Python?",
    explanation: "The GIL prevents multi-threaded CPython from running threads concurrently on multiple CPU cores."
  },
  {
    id: 15,
    q: "What is the difference between append() and extend() on Python Lists?",
    options: ["append() adds its argument as a single element; extend() iterates over its argument adding each element", "extend() only works on numbers", "append() sorts the list", "They perform identical operations"],
    correct: 0,
    ref: "W3Schools: Python List Methods",
    explanation: "append([1,2]) adds a list as a single sublist; extend([1,2]) appends individual items to the end."
  },
  {
    id: 16,
    q: "What is a Decorator in Python?",
    options: ["A function that takes another function as an argument and extends its behavior without modifying it", "A CSS styling rule", "A database index", "A UI component"],
    correct: 0,
    ref: "GeeksforGeeks: Python Decorators",
    explanation: "Decorators wrap functions using @decorator_name syntax to add pre or post-execution behavior."
  },
  {
    id: 17,
    q: "Which Pandas method is used to remove rows containing missing or NaN values?",
    options: ["dropna()", "fillna()", "remove_null()", "clean_na()"],
    correct: 0,
    ref: "W3Schools: Pandas Cleaning Empty Cells",
    explanation: "dropna() filters out rows or columns containing missing values from a DataFrame."
  },
  {
    id: 18,
    q: "What does the lambda keyword define in Python?",
    options: ["An anonymous inline function that can take arguments but evaluates a single expression", "A mathematical constant", "A multi-line block", "A system process"],
    correct: 0,
    ref: "W3Schools: Python Lambda",
    explanation: "Lambda functions are small, anonymous functions defined in a single line without a def keyword."
  },
  {
    id: 19,
    q: "In Supervised Machine Learning, what is Overfitting?",
    options: ["When a model learns training data noise too well and performs poorly on unseen test data", "When data has 0 values", "When the model trains in 1 second", "When accuracy is 50%"],
    correct: 0,
    ref: "GeeksforGeeks: Underfitting and Overfitting in Machine Learning",
    explanation: "Overfitting occurs when a high-complexity model memorizes training samples instead of generalizing patterns."
  },
  {
    id: 20,
    q: "Which evaluation metric measures the proportion of true positive predictions among all positive predictions made by a classifier?",
    options: ["Precision", "Recall", "Mean Squared Error", "R2 Score"],
    correct: 0,
    ref: "GeeksforGeeks: Precision and Recall in Machine Learning",
    explanation: "Precision = True Positives / (True Positives + False Positives), measuring accuracy of positive calls."
  }
];
