
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export interface Message {
    role: 'user' | 'model';
    text: string;
}

export const useChatbot = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Greetings. I am Cogito AI (Model: Gemini 3 Pro). How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Store chat session in ref to persist across renders
    const chatSession = useRef<any>(null);

    useEffect(() => {
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            chatSession.current = ai.chats.create({
                model: 'gemini-3-pro-preview',
                config: {
                    systemInstruction: "You are a helpful, witty, and slightly retro-themed AI assistant living inside a web-based operating system called Cogito OS. Keep your responses concise and formatted nicely with Markdown.",
                }
            });
        }
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        if (!chatSession.current) {
             setMessages(prev => [...prev, { role: 'model', text: "Error: API Key not found. Please ensure the system environment is configured correctly." }]);
             setIsLoading(false);
             return;
        }

        try {
            const result = await chatSession.current.sendMessage({ message: userMsg });
            const responseText = result.text;
            
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Error: Communication link severed. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        setInput,
        isLoading,
        sendMessage
    };
};
