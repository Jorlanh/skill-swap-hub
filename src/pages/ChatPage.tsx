import { useState } from 'react';
import { mockConversations, mockChatMessages, mockUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Video, Info, Camera, Mic, Send, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const [selectedConvo, setSelectedConvo] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-foreground font-semibold mb-4 hover:opacity-80">
        <ChevronLeft className="h-5 w-5" /> Voltar
      </Link>

      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Conversations list */}
        <div className="w-72 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💬</span>
            <h2 className="font-display font-bold text-xl text-foreground">Conversas</h2>
          </div>
          <div className="space-y-1">
            {mockConversations.map((convo) => (
              <div
                key={convo.id}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedConvo.id === convo.id
                    ? 'bg-skillswap-light-blue'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedConvo(convo)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={convo.user.avatar} />
                    <AvatarFallback>{convo.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-foreground">{convo.user.username}</span>
                      {convo.user.isVerified && <Star className="h-3 w-3 text-skillswap-gold fill-skillswap-gold" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {convo.isRead && '✓✓ '}{convo.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="border-b border-border mt-3" />
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-skillswap-card-bg rounded-2xl flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConvo.user.avatar} />
                <AvatarFallback>{selectedConvo.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-lg text-foreground">{selectedConvo.user.username}</span>
                {selectedConvo.user.isVerified && <Star className="h-5 w-5 text-skillswap-gold fill-skillswap-gold" />}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Info className="h-5 w-5" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="text-center">
              <span className="text-xs bg-skillswap-light-blue text-foreground px-3 py-1 rounded-full">07 de Abril</span>
            </div>
            {mockChatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  msg.isOwn
                    ? 'bg-skillswap-light-blue text-foreground'
                    : 'bg-card text-foreground border border-border'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 flex items-center gap-3">
            <Button variant="ghost" size="icon"><Plus className="h-5 w-5" /></Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite aqui.."
              className="flex-1 bg-muted rounded-full"
            />
            <Button variant="ghost" size="icon"><Camera className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
            <Button size="icon" className="bg-skillswap-teal text-primary-foreground rounded-full hover:opacity-90">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
