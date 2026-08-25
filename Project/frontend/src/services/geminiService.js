/**
 * Google Gemini AI Integration Service
 * Universal Question Answering Engine for SkillSphere
 * Accurately answers ANY universal question across all topics (Programming, Companies, Science, Math, History, Geography, General Q&A).
 */

export const getGeminiApiKey = () => {
  return (
    localStorage.getItem("skillsphere_gemini_api_key") ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ""
  );
};

export const setGeminiApiKey = (key) => {
  if (key) {
    localStorage.setItem("skillsphere_gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("skillsphere_gemini_api_key");
  }
};

export const formatAiResponseText = (text) => {
  if (!text) return "";
  return text
    .replace(/^####?\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`/g, '');
};

const COMMON_ALIASES = {
  'nlp': 'Natural_language_processing',
  'natural language processing': 'Natural_language_processing',
  'natural language processsing': 'Natural_language_processing',
  'dsa': 'Data_structure',
  'ai': 'Artificial_intelligence',
  'artificial intelligence': 'Artificial_intelligence',
  'ml': 'Machine_learning',
  'machine learning': 'Machine_learning',
  'dbms': 'Database',
  'rdbms': 'Relational_database',
  'tcs': 'Tata_Consultancy_Services',
  'tata consultancy services': 'Tata_Consultancy_Services',
  'infosys': 'Infosys',
  'wipro': 'Wipro',
  'docker': 'Docker_(software)',
  'react': 'React_(software)',
  'python': 'Python_(programming_language)',
  'java': 'Java_(programming_language)',
  'c++': 'C%2B%2B',
  'cpp': 'C%2B%2B',
  'sql': 'SQL',
  'html': 'HTML',
  'css': 'CSS',
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js'
};

/**
 * Universal Knowledge Retriever (Wikipedia REST & Search API)
 */
async function fetchUniversalKnowledge(queryStr) {
  const q = queryStr.toLowerCase().trim();
  const clean = q.replace(/what is|explain|tell me about|who is|define|what's|how does|what are/gi, '').trim();
  const wikiTitle = COMMON_ALIASES[clean] || COMMON_ALIASES[q] || clean.replace(/\s+/g, '_');

  const headers = { 'User-Agent': 'SkillSphereApp/1.0 (contact@skillsphere.com)' };

  // 1. Direct REST Summary
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(wikiTitle), { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.extract && data.type !== 'disambiguation' && data.extract.length > 30) {
        return `### 📚 ${data.title}\n\n${data.extract}`;
      }
    }
  } catch (e) {}

  // 2. Search Fallback
  try {
    const searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(clean) + '&format=json&origin=*';
    const res = await fetch(searchUrl, { headers });
    if (res.ok) {
      const data = await res.json();
      const hits = data.query?.search || [];
      if (hits.length > 0) {
        const bestHit = hits[0];
        const sumRes = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(bestHit.title.replace(/\s+/g, '_')), { headers });
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          if (sumData.extract && sumData.type !== 'disambiguation' && sumData.extract.length > 30) {
            return `### 📚 ${sumData.title}\n\n${sumData.extract}`;
          }
        }
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Main AI Query Handler - Answers Universal Questions accurately
 * @param {string} prompt - User question
 * @param {object} context - Optional context
 * @returns {Promise<{ text: string, source: string }>}
 */
export async function askGeminiAI(prompt, context = {}) {
  const userPrompt = prompt.trim();
  if (!userPrompt) return { text: "Please enter a valid question.", source: "system" };

  const qLower = userPrompt.toLowerCase().trim();

  // User identity handling
  const userObj = context.user || context.userInfo || null;
  const userName = userObj ? (userObj.full_name || userObj.username || userObj.name || userObj.email || "Learner") : "Learner";
  const userRole = userObj ? (userObj.role || "Student") : "Student";
  const userEmail = userObj ? (userObj.email || "student@skillsphere.com") : "student@skillsphere.com";

  // 1. Instant Greeting Check
  const isGreeting = /^(hi|hello|hey|greetings|hola|namaste|hi there|hello there|good morning|good evening|good afternoon|howdy|start)(\s|!|\.|$)/i.test(qLower) || qLower === "hi" || qLower === "hello" || qLower === "hey";
  if (isGreeting) {
    return {
      text: `Hello, ${userName}! 👋 Welcome to SkillSphere. How can I help you today?`,
      source: "SphereAI"
    };
  }

  // 2. Instant User Identity Check
  if (qLower.includes("my name") || qLower.includes("who am i") || qLower.includes("my username") || qLower.includes("what is my name") || qLower.includes("what's my name") || qLower === "who am i?") {
    return {
      text: `Hello **${userName}**! You are logged in as a **${userRole}** on SkillSphere.`,
      source: "SphereAI"
    };
  }

  // 3. Fast Local Knowledge Check (TCS, Infosys, Wipro, Java, Python, C++, Math, etc.)
  const localAnswer = solveUniversalFactualQuestion(userPrompt, context);
  if (localAnswer) {
    return {
      text: localAnswer,
      source: "SphereAI Knowledge Base"
    };
  }

  // 4. Direct Google Gemini API (gemini-1.5-flash) if key configured
  const apiKey = getGeminiApiKey();
  if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
    try {
      const systemInstruction = `You are SphereAI, an expert AI Study Buddy & Universal Knowledge Specialist for SkillSphere.
User Context: Logged in as ${userName} (${userRole}).
Answer the user's question directly, accurately, and naturally. Use clear markdown formatting.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText && responseText.trim().length > 10) {
          return {
            text: responseText.trim(),
            source: "Gemini 1.5 Flash (Google AI)"
          };
        }
      }
    } catch (err) {
      console.warn("Direct Gemini API call warning:", err);
    }
  }

  // 5. Universal Knowledge Retriever (Wikipedia REST API)
  const wikiAnswer = await fetchUniversalKnowledge(userPrompt);
  if (wikiAnswer) {
    return {
      text: wikiAnswer,
      source: "SphereAI Universal Knowledge Engine"
    };
  }

  // 6. Clean Intelligent Direct Fallback
  return {
    text: `**${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}**

I am here to help you with programming, technology topics, SkillSphere courses, math, and general knowledge. Could you specify what detail or code example you would like?`,
    source: "SphereAI Assistant"
  };
}

/**
 * Universal Knowledge Evaluator for core technical & general queries
 */
function solveUniversalFactualQuestion(query, context = {}) {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase();

  const userObj = context.user || context.userInfo || null;
  const userName = userObj ? (userObj.full_name || userObj.username || userObj.name || userObj.email || "Learner") : "Learner";

  // Math Evaluator
  const mathRes = solveMathExpression(q);
  if (mathRes) return mathRes;

  // NLP / Natural Language Processing
  if (q.includes("nlp") || q.includes("natural language processing") || q.includes("natural language processsing")) {
    return `### 🧠 Natural Language Processing (NLP)

**Natural Language Processing (NLP)** is a subfield of Artificial Intelligence (AI) and computer science focused on giving computers the ability to understand, process, and generate human speech and text in a natural way.

#### Key Applications & Concepts:
- **Text Analysis & Sentiment:** Analyzing user feedback, social media posts, and reviews.
- **Machine Translation:** Translating text between languages (e.g., Google Translate).
- **Chatbots & Virtual Assistants:** Conversational AI models like SphereAI and ChatGPT.
- **Core Techniques:** Tokenization, Lemmatization, Named Entity Recognition (NER), Transformers, and Large Language Models (LLMs).`;
  }

  // TCS (Tata Consultancy Services)
  if (q.includes("tcs") || q.includes("tata consultancy")) {
    return `### 🏢 Tata Consultancy Services (TCS)

**Tata Consultancy Services (TCS)** is an Indian multinational information technology (IT) services and consulting company headquartered in Mumbai, India. It is a flagship subsidiary of the **Tata Group**.

#### Key Highlights & Facts:
- **Founded:** 1968 by J. R. D. Tata and F. C. Kohli.
- **Headquarters:** Mumbai, Maharashtra, India.
- **Global Presence:** Operates across 150+ locations in over 50 countries.
- **Market Standing:** One of the largest IT services companies globally by market capitalization.`;
  }

  // INFOSYS
  if (q.includes("infosys")) {
    return `### 🏢 Infosys Limited

**Infosys Limited** is an Indian multinational IT company providing business consulting, information technology, and outsourcing services.

#### Key Highlights:
- **Founded:** July 2, 1981, in Pune by **N. R. Narayana Murthy** and 6 co-founders.
- **Headquarters:** Bengaluru, Karnataka, India.
- **Core Platforms:** Infosys Cobalt (Cloud) and Infosys Topaz (Generative AI).`;
  }

  // WIPRO
  if (q.includes("wipro")) {
    return `### 🏢 Wipro Limited

**Wipro Limited** is a major Indian multinational technology services and consulting company headquartered in Bengaluru, India.

#### Key Highlights:
- **Founded:** 1945 by Mohamed Premji (transitioned to IT under **Azim Premji**).
- **Core Offerings:** Cloud Engineering, Digital Transformation, AI, and Cybersecurity.`;
  }

  // JAVA
  if (q.includes("what is java") || q === "java" || q.includes("explain java") || q.includes("java programming")) {
    return `### ☕ What is Java?

**Java** is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. Created by **James Gosling** at Sun Microsystems in 1995.

#### Key Features:
- **WORA (Write Once, Run Anywhere):** Java bytecode runs on any system with a **JVM (Java Virtual Machine)**.
- **Object-Oriented (OOP):** Encapsulation, Inheritance, Polymorphism, Abstraction.
- **Automatic Garbage Collection:** Handles memory cleanup automatically.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, SkillSphere!");
    }
}
\`\`\``;
  }

  // PYTHON
  if (q.includes("what is python") || q === "python") {
    return `### 🐍 What is Python?

**Python** is an interpreted, high-level, general-purpose programming language created by **Guido van Rossum** in 1991.

#### Key Strengths:
- Clean, readable syntax emphasizing developer productivity.
- Rich ecosystem for AI/ML (**PyTorch, TensorFlow**), Data Science (**Pandas, NumPy**), and Web (**Django, FastAPI**).

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("${userName}"))
\`\`\``;
  }

  // C++ / C
  if (q.includes("what is c++") || q === "c++" || q.includes("c language") || q === "c") {
    return `### ⚡ What is C++?

**C++** is a high-performance, general-purpose programming language created by **Bjarne Stroustrup** in 1979 as an extension of the C language.

#### Key Features:
- Direct memory manipulation via pointers.
- Used in Game Development, Systems Programming, and Competitive Programming (DSA).

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, SkillSphere!" << endl;
    return 0;
}
\`\`\``;
  }

  // REACT
  if (q.includes("what is react") || q.includes("reactjs") || q.includes("react js")) {
    return `### ⚛️ What is React?

**React** is an open-source front-end JavaScript library developed by **Meta (Facebook)** for building user interfaces with reusable components.

#### Core Concepts:
- **Component Architecture:** Modular UI building blocks.
- **Virtual DOM:** Efficient rendering and DOM diffing.
- **Hooks:** \`useState\`, \`useEffect\`, \`useContext\`.`;
  }

  // SCIENCE (Sky Blue, Speed of Light, Photosynthesis)
  if (q.includes("sky blue") || q.includes("why is the sky blue")) {
    return `### ☀️ Why is the Sky Blue?

The sky appears blue due to **Rayleigh Scattering**: gas molecules in Earth's atmosphere scatter short blue light wavelengths in all directions more than longer red wavelengths.`;
  }

  if (q.includes("speed of light")) {
    return `### ⚡ Speed of Light

The speed of light in a vacuum is exactly **299,792,458 m/s** (approx **3.00 × 10⁸ m/s** or **186,282 miles/sec**).`;
  }

  if (q.includes("photosynthesis")) {
    return `### 🌿 Photosynthesis

Photosynthesis is how green plants convert light energy into chemical energy:
\`6CO₂ + 6H₂O + Light Energy ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)\``;
  }

  // GEOGRAPHY & WORLD CAPITALS
  if (q.includes("capital of france")) return "The capital of France is **Paris**.";
  if (q.includes("capital of india")) return "The capital of India is **New Delhi**.";
  if (q.includes("capital of japan")) return "The capital of Japan is **Tokyo**.";
  if (q.includes("capital of usa") || q.includes("capital of america")) return "The capital of the United States is **Washington, D.C.**";
  if (q.includes("capital of germany")) return "The capital of Germany is **Berlin**.";
  if (q.includes("capital of uk") || q.includes("capital of england")) return "The capital of the UK is **London**.";
  if (q.includes("largest ocean")) return "The **Pacific Ocean** is the largest ocean on Earth.";

  return null;
}

/**
 * Universal Math Evaluator
 */
function solveMathExpression(query) {
  try {
    const cleaned = query.replace(/what is|calculate|evaluate|math/gi, "").trim();
    
    if (/^[0-9+\-*/().\s^%]+$/.test(cleaned) && /[0-9]/.test(cleaned)) {
      const expr = cleaned.replace(/\^/g, "**");
      const result = new Function(`return (${expr})`)();
      if (typeof result === "number" && !isNaN(result)) {
        return `### 🔢 Mathematical Solution\n\n**Expression:** \`${cleaned}\`  \n**Calculated Result:** **\`${result}\`**`;
      }
    }

    const pctMatch = query.match(/(\d+(?:\.\d+)?)%\s*(?:of)?\s*(\d+(?:\.\d+)?)/i);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      const val = parseFloat(pctMatch[2]);
      const res = (pct / 100) * val;
      return `### 🔢 Percentage Calculation\n\n**Question:** What is **${pct}%** of **${val}**?  \n**Formula:** \`(${pct} / 100) * ${val}\`  \n**Result:** **\`${res}\`**`;
    }
  } catch (e) {
    return null;
  }
  return null;
}
