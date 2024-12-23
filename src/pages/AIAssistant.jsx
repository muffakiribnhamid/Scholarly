import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput('');
    
    // Show loading state
    setIsLoading(true);
    
    try {
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GOOGLE_API_KEY
      );
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro"
      });

      const result = await model.generateContent(input);
      const response = await result.response;
      const aiMessage = {
        type: 'ai',
        content: response.text()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
      
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[900px] bg-gray-50 p-4">
      <div className="flex-1 overflow-auto mb-4 bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.type === 'user' ? (
                  message.content
                ) : (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-3 text-gray-800">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;