
import React from 'react';
import { WindowDef, ContentItem } from '../../types';
import { useChatbot } from './hooks/use-chatbot';
import { ChatbotView } from './components/ChatbotView';

interface ChatbotProps {
    win: WindowDef;
    contentItem: ContentItem;
}

export const Chatbot: React.FC<ChatbotProps> = ({ win }) => {
    const { messages, input, setInput, isLoading, sendMessage } = useChatbot();

    return (
        <ChatbotView 
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSend={sendMessage}
        />
    );
};
