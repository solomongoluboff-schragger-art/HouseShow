import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { MessageCircle, Send, Calendar } from 'lucide-react';
import {
  Conversation,
  Message,
  listMessages,
  sendMessage,
} from '../lib/api';

interface MessagingSystemProps {
  userType: 'artist' | 'host';
  onBack: () => void;
  currentUserId: string | null;
  conversations: Conversation[];
  authToken: string;
  initialConversationId?: string | null;
  onCreateProposal?: (conversationId: string) => void;
  onReviewProposal?: (conversationId: string) => void;
}

export function MessagingSystem({
  userType,
  onBack,
  currentUserId,
  conversations,
  authToken,
  initialConversationId,
  onCreateProposal,
  onReviewProposal,
}: MessagingSystemProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (initialConversationId && conversations.some((c) => c.id === initialConversationId)) {
      setSelectedConversationId(initialConversationId);
      return;
    }

    if (
      !selectedConversationId ||
      !conversations.some((conversation) => conversation.id === selectedConversationId)
    ) {
      setSelectedConversationId(conversations[0]?.id ?? null);
    }
  }, [conversations, initialConversationId, selectedConversationId]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const otherProfile = useMemo(() => {
    if (!selectedConversation) {
      return null;
    }

    if (userType === 'artist') {
      const hostProfile = selectedConversation.hostUser?.hostProfile;
      return {
        name: hostProfile?.displayName || 'Host',
        avatar: hostProfile?.images?.[0] || '/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg',
        userType: 'Host',
      };
    }

    const artistProfile = selectedConversation.artistUser?.artistProfile;
    return {
      name: artistProfile?.displayName || 'Artist',
      avatar: artistProfile?.imageUrl || '/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg',
      userType: 'Artist',
    };
  }, [selectedConversation, userType]);

  const formatConversationTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const loadMessages = async () => {
    if (!selectedConversationId || !authToken) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    setMessagesError(null);

    try {
      const data = await listMessages(selectedConversationId, authToken);
      setMessages(data.messages);
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Failed to load messages.');
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, [selectedConversationId, authToken]);

  const proposalStatus = selectedConversation?.proposal?.status;

  const artistActionLabel =
    proposalStatus === 'SENT'
      ? 'Proposal Sent'
      : proposalStatus === 'CONFIRMED'
        ? 'Proposal Confirmed'
        : 'Create Event Proposal';

  const handleSendMessage = async () => {
    if (!selectedConversationId || !authToken) return;

    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      await sendMessage(selectedConversationId, messageText, authToken);
      setMessageText('');
      await loadMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
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
        <div className="w-80 border-r border-border bg-card overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Conversations
            </h2>
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const title =
                  userType === 'artist'
                    ? conversation.hostUser?.hostProfile?.displayName || 'Host'
                    : conversation.artistUser?.artistProfile?.displayName || 'Artist';
                const preview = conversation.proposal
                  ? `Proposal ${conversation.proposal.status.toLowerCase()}`
                  : 'No proposal yet';
                const isSelected = selectedConversationId === conversation.id;
                const hasAttention =
                  (userType === 'host' && conversation.proposal?.status === 'SENT') ||
                  (userType === 'artist' && !conversation.proposal);

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-secondary/20 hover:bg-secondary/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
                        <img
                          src={
                            userType === 'artist'
                              ? conversation.hostUser?.hostProfile?.images?.[0] || '/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg'
                              : conversation.artistUser?.artistProfile?.imageUrl || '/photos/7bca2e83-a717-4819-8ffa-1fb44e15ad32_rw_1920.jpg'
                          }
                          alt="Conversation"
                          className="w-full h-full object-cover"
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-foreground truncate">{title}</p>
                          {hasAttention ? (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{preview}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatConversationTime(conversation.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {!conversations.length ? (
                <p className="text-sm text-muted-foreground px-2 pt-1">No conversations yet.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-full">
                    <img
                      src={otherProfile?.avatar ?? ''}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{otherProfile?.name}</p>
                    <p className="text-xs text-muted-foreground">{otherProfile?.userType}</p>
                  </div>
                </div>

                {userType === 'artist' && onCreateProposal && proposalStatus !== 'CONFIRMED' ? (
                  <Button
                    disabled={proposalStatus === 'SENT'}
                    onClick={() => onCreateProposal(selectedConversation.id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    {artistActionLabel}
                  </Button>
                ) : null}

                {userType === 'host' && onReviewProposal && proposalStatus === 'SENT' ? (
                  <Button
                    onClick={() => onReviewProposal(selectedConversation.id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Review Proposal
                  </Button>
                ) : null}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
                {messagesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                ) : messagesError ? (
                  <p className="text-sm text-destructive">{messagesError}</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages yet. Say hi.</p>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.senderUserId === currentUserId;
                    const messageTime = formatConversationTime(message.createdAt);

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-lg ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card border border-border text-foreground'
                          }`}
                        >
                          <p className="text-sm mb-1">{message.body}</p>
                          <p
                            className={`text-xs ${
                              isCurrentUser
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {messageTime}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-input-background border-border"
                  />
                  <Button
                    onClick={() => void handleSendMessage()}
                    disabled={isSending}
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
