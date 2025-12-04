import React, { useState, useEffect, useRef } from 'react';
// FIX: Merged imports from geminiService.
import { generateTextStream, translateText } from '../services/geminiService';
import { Language } from '../types';
import Card from './common/Card';

interface Message {
  text: string;
  isUser: boolean;
}

interface AiChatbotProps {
    language: Language;
}

const AiChatbot: React.FC<AiChatbotProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [translatedText, setTranslatedText] = useState({
        title: "AI Medical Doctor",
        subtitle: "Ask me any health-related question. I am trained on medical datasets.",
        placeholder: "Type your symptoms or question here...",
        send: "Send",
        disclaimer: "Disclaimer: This AI is for informational purposes only and is not a substitute for professional medical advice. Always consult a doctor for diagnosis and treatment.",
        initialMessage: "Hello! How can I help you with your health today?"
    });

    useEffect(() => {
        const translate = async () => {
            const initialMessageText = await translateText("Hello! How can I help you with your health today?", language);
            setMessages([{ text: initialMessageText, isUser: false }]);
            setTranslatedText({
                title: await translateText("AI Medical Doctor", language),
                subtitle: await translateText("Ask me any health-related question. I am trained on medical datasets.", language),
                placeholder: await translateText("Type your symptoms or question here...", language),
                send: await translateText("Send", language),
                disclaimer: await translateText("Disclaimer: This AI is for informational purposes only and is not a substitute for professional medical advice. Always consult a doctor for diagnosis and treatment.", language),
                initialMessage: initialMessageText,
            });
        };
        translate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const systemInstruction = `You are a highly trusted, expert AI medical doctor. Your knowledge is based on extensive, verified medical datasets, textbooks, and clinical guidelines. Your primary goal is to provide safe, accurate, and easy-to-understand health information.
    RULES:
    1.  ALWAYS prioritize user safety. If a query suggests a serious condition, strongly advise seeing a real doctor immediately.
    2.  DO NOT provide definitive diagnoses or prescriptions. Instead, offer potential explanations and suggest appropriate next steps (e.g., "consult a GP," "see a specialist," "visit an emergency room").
    3.  Break down complex medical terms into simple language.
    4.  Structure your responses clearly, using headings, lists, or bullet points where helpful.
    5.  ALWAYS include a clear disclaimer at the end of every response: "This is for informational purposes only. Consult a qualified healthcare professional for medical advice."
    6.  Answer in the language of the user's query. If the user asks in ${language}, respond in ${language}.`;

    const handleSend = async () => {
        if (input.trim() === '' || loading) return;
    
        const userMessageText = input;
        setInput('');
        setLoading(true);
    
        setMessages(prev => [...prev, { text: userMessageText, isUser: true }, { text: '', isUser: false }]);
    
        try {
            const stream = generateTextStream(userMessageText, systemInstruction);
            for await (const chunk of stream) {
                setMessages(prevMessages => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
                    return [...prevMessages.slice(0, -1), updatedLastMessage];
                });
            }
        } catch (error) {
            console.error("Chatbot stream error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = "An error occurred while streaming the response.";
                return newMessages;
            });
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <Card className="max-w-4xl mx-auto flex flex-col h-[85vh]">
        <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-slate-100">{translatedText.title}</h1>
            <p className="text-slate-400">{translatedText.subtitle}</p>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-900/50 rounded-lg">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg px-4 py-2 rounded-2xl ${msg.isUser ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700 text-slate-200'}`}>
                        <p className="prose prose-invert max-w-none" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    </div>
                </div>
            ))}
            {loading && messages[messages.length - 1]?.isUser && (
                <div className="flex justify-start">
                     <div className="max-w-lg px-4 py-2 rounded-2xl bg-slate-700">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 border-t border-slate-700 pt-4">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={translatedText.placeholder}
                    className="flex-grow border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-700 text-slate-200"
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-pink-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 shadow-lg shadow-pink-500/30"
                >
                    {translatedText.send}
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">{translatedText.disclaimer}</p>
        </div>
    </Card>
  );
};

export default AiChatbot;