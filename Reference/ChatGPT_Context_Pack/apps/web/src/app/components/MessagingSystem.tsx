import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { MessageCircle, Send, Calendar } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  otherUser: {
    name: string;
    avatar: string;
    type: 'artist' | 'host';
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface MessagingSystemProps {
  userType: 'artist' | 'host';
  onBack: () => void;
  onCreateProposal?: (conversationId: string) => void;
}

export function MessagingSystem({ userType, onBack, onCreateProposal }: MessagingSystemProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Mock conversations
  const conversations: Conversation[] = userType === 'artist' ? [
    {
      id: '1',
      otherUser: {
        name: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        type: 'host'
      },
      lastMessage: 'That sounds great! When are you thinking?',
      timestamp: '2h ago',
      unread: true
    },
    {
      id: '2',
      otherUser: {
        name: 'Jake R.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        type: 'host'
      },
      lastMessage: 'Thanks for reaching out!',
      timestamp: '1d ago',
      unread: false
    }
  ] : [
    {
      id: '1',
      otherUser: {
        name: 'The Violet Echoes',
        avatar: 'https://i.pravatar.cc/150?img=1',
        type: 'artist'
      },
      lastMessage: 'We\'d love to play at your venue!',
      timestamp: '1h ago',
      unread: true
    },
    {
      id: '2',
      otherUser: {
        name: 'Luna West',
        avatar: 'https://i.pravatar.cc/150?img=2',
        type: 'artist'
      },
      lastMessage: 'Looking forward to the show',
      timestamp: '3d ago',
      unread: false
    }
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      senderName: userType === 'artist' ? 'Sarah M.' : 'The Violet Echoes',
      text: userType === 'artist' 
        ? 'Hi! I saw your band and would love to have you play at my venue.'
        : 'Hey! We\'re interested in playing at your space in Williamsburg.',
      timestamp: '2h ago',
      isCurrentUser: false
    },
    {
      id: '2',
      senderId: 'current',
      senderName: 'You',
      text: userType === 'artist'
        ? 'Thanks for reaching out! We\'d love to discuss details.'
        : 'Great! Let me know what dates work for you.',
      timestamp: '1h ago',
      isCurrentUser: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: userType === 'artist' ? 'Sarah M.' : 'The Violet Echoes',
      text: userType === 'artist'
        ? 'That sounds great! When are you thinking?'
        : 'We\'re free the first weekend of February!',
      timestamp: '45m ago',
      isCurrentUser: false
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message
      setMessageText('');
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          ← back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-border bg-card overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Conversations
            </h2>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedConversation === conv.id
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-secondary/20 hover:bg-secondary/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
                      <img 
                        src={conv.otherUser.avatar} 
                        alt={conv.otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground truncate">
                          {conv.otherUser.name}
                        </p>
                        {conv.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conv.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-full">
                    <img 
                      src={conversations.find(c => c.id === selectedConversation)?.otherUser.avatar} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {conversations.find(c => c.id === selectedConversation)?.otherUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversations.find(c => c.id === selectedConversation)?.otherUser.type}
                    </p>
                  </div>
                </div>
                
                {/* Create Event Proposal Button (Artists only) */}
                {userType === 'artist' && onCreateProposal && (
                  <Button
                    onClick={() => onCreateProposal(selectedConversation)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Create Event Proposal
                  </Button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        message.isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground'
                      }`}
                    >
                      <p className="text-sm mb-1">{message.text}</p>
                      <p className={`text-xs ${
                        message.isCurrentUser 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-input-background border-border"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-secondary/10">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
