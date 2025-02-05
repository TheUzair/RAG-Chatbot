# RAG-Based Chatbot

## 🚀 Overview
This project is a **Retrieval-Augmented Generation (RAG) chatbot** built with **Next.js 15+ (App Router), Groq API, Weaviate vector database, Puppeteer, and Redux for state management**. The chatbot scrapes content from user-provided URLs, stores it in a vector database, and generates intelligent responses with real-time citations.

## 🎯 Features
- **RAG Architecture**: Enhances chatbot responses with relevant retrieved content.
- **Source Citations**: Displays clickable links to the original sources.
- **Real-Time Scraping**: Uses Puppeteer for web scraping.
- **Weaviate for Vector Storage**: Efficient storage and retrieval of knowledge.
- **Groq API for AI Responses**: Generates accurate, context-aware responses.
- **Redux for State Management**: Handles chat history efficiently.
- **Next.js App Router**: Optimized for server-side and client-side rendering.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+, React, Tailwind CSS, Redux
- **Backend**: Node.js, Express, Puppeteer, Weaviate, Groq API
- **Database**: Weaviate (vector storage)
- **Deployment**: Vecerl

## Deployment
- **Live Website**: [https://rag-chatbot-eta.vercel.app](https://rag-chatbot-eta.vercel.app)

## 📦 Installation
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/TheUzair/RAG-Chatbot.git
cd rag-chatbot
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file and add:
```env
GROQ_API_KEY=your-groq-api-key
WEAVIATE_URL=your-weaviate-instance-url
WEAVIATE_API_KEY=your-weaviate-api-key
```

### 4️⃣ Run the Application
```bash
npm run dev
```
Access the chatbot at `http://localhost:3000`.

## 🔧 How It Works
### 1️⃣ Scraping a Website
- User enters a URL.
- Puppeteer extracts text content.
- Data is stored in Weaviate as vector embeddings.

### 2️⃣ Query Processing
- User asks a question.
- Weaviate retrieves the most relevant content.
- Groq API generates a response using both retrieved and general knowledge.

### 3️⃣ Response Display
- The chatbot displays the response.
- If a source is available, a clickable citation is shown.

## 💬 Example Responses
### ✅ Example 1: Factual Query
**User:** *"What is quantum computing?"*
**Bot:** *"Quantum computing uses quantum bits (qubits) to perform computations that classical computers struggle with. [Click here](https://example.com/quantum-computing) to read more."*

### ✅ Example 2: Context-Aware Query
**User:** *"Summarize the main points of this article."*
**Bot:** *"The article discusses the latest AI trends, focusing on ethical concerns and advancements. [Click here](https://example.com/ai-trends) for details."*

## 🛑 Edge Cases
### ✅ Handled Cases
- **Empty Queries**: Prevents sending blank messages.
- **Invalid URLs**: Displays an error if an incorrect URL is entered.
- **Slow Responses**: Shows a loading indicator while fetching results.
- **Rate Limits**: Implements retry mechanisms.

### ❌ Unhandled Cases
- **JavaScript-Rendered Pages**: If content is hidden behind client-side rendering, Puppeteer may not capture it.
- **Highly Dynamic Content**: Pages that change frequently may lead to outdated embeddings.
- **Multimodal Inputs**: Currently, only text-based queries are supported.

## 📌 Future Enhancements
- ✅ Add support for multimedia content retrieval (images, videos).
- ✅ Improve citation handling with multiple source references.
- ✅ Enhance multi-turn conversations.
- ✅ Expand language support for global users.

## 🤝 Contributing
Pull requests are welcome! Feel free to fork the repo and submit your contributions.

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---