import React, { useState, KeyboardEvent, ReactNode } from 'react';

// Define a type for the props expected by each component
type DrawerProps = {
  open: boolean;
  children: ReactNode;
};

type DrawerHeaderProps = {
  children: ReactNode;
};

type DrawerTitleProps = {
  children: ReactNode;
};

type DrawerCloseProps = {
  onClick: () => void;
};

type DrawerContentProps = {
  children: ReactNode;
};

type DrawerDescriptionProps = {
  children: ReactNode;
};

type DrawerFooterProps = {
  children: ReactNode;
};

type DrawerTriggerProps = {
  onClick: () => void;
  children: ReactNode;
};

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

// Use the defined types for the function parameters
const Drawer = ({ open, children }: DrawerProps) => open ? <div className="drawer">{children}</div> : null;
const DrawerHeader = ({ children }: DrawerHeaderProps) => <div className="drawer-header">{children}</div>;
const DrawerTitle = ({ children }: DrawerTitleProps) => <div className="drawer-title">{children}</div>;
const DrawerClose = ({ onClick }: DrawerCloseProps) => <button onClick={onClick}>Close</button>;
const DrawerContent = ({ children }: DrawerContentProps) => <div className="drawer-content">{children}</div>;
const DrawerDescription = ({ children }: DrawerDescriptionProps) => <div className="drawer-description">{children}</div>;
const DrawerFooter = ({ children }: DrawerFooterProps) => <div className="drawer-footer">{children}</div>;
const DrawerTrigger = ({ onClick, children }: DrawerTriggerProps) => <button onClick={onClick}>{children}</button>;
const Button = ({ onClick, children }: ButtonProps) => <button onClick={onClick}>{children}</button>;

interface Message {
    user?: string;
    bot?: string;
}

const Chatbot = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSendMessage = async (message: string) => {
        console.log('Sending message:', message);
        try {
            const response = await fetch('/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Update messages state with user message and bot response
            setMessages([...messages, { user: message }, { bot: data.response }]);
            console.log('Received response:', data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const input = event.currentTarget;
            handleSendMessage(input.value);
            input.value = ''; // Clear input after sending
        }
    };
    console.log('Drawer open state:', isDrawerOpen);
    console.log('Messages:', messages);
    return (
        <div>
            <DrawerTrigger onClick={() => setIsDrawerOpen(true)}>Open Chatbot</DrawerTrigger>
            <Drawer open={isDrawerOpen}>
                <DrawerHeader>
                    <DrawerTitle>Chatbot</DrawerTitle>
                    <DrawerClose onClick={() => setIsDrawerOpen(false)} />
                </DrawerHeader>
                <DrawerContent>
                    <DrawerDescription>This is your friendly chatbot!</DrawerDescription>
                    <DrawerFooter>
                        {/* Chat messages */}
                        {messages.map((msg, index) => (
                            <div key={index}>
                                {msg.user && <div>User: {msg.user}</div>}
                                {msg.bot && <div>Bot: {msg.bot}</div>}
                            </div>
                        ))}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <input type="text" onKeyDown={handleKeyDown} />
            <Button onClick={() => setIsDrawerOpen(true)}>Open Chatbot</Button>
        </div>
    );
};

export default Chatbot;
