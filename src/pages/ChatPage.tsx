import { useEffect, useState, useRef } from 'react';
import { ChatService, BASE_URL } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Plus, Video, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Carrega conversas com tratamento de erro
    ChatService.getConversations()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setConversations(data);
        if (data.length > 0) setSelectedConvo(data[0]);
      })
      .catch(() => setConversations([]));

    // 2. Conexão WebSocket Segura
    const token = localStorage.getItem('token');
    if (token && token !== "null") {
      const wsUrl = BASE_URL.replace('http', 'ws').replace('/api', '/chat');
      socket.current = new WebSocket(`${wsUrl}?token=${token}`);

      socket.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          setMessages(prev => [...prev, msg]);
        } catch (e) {
          console.error("Erro ao decodificar mensagem recebida.");
        }
      };

      socket.current.onerror = () => console.error("Falha na conexão com o servidor de chat.");
    }

    return () => socket.current?.close();
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !socket.current || socket.current.readyState !== WebSocket.OPEN) return;
    
    const payload = { 
      content: message, 
      conversationId: selectedConvo?.id,
      timestamp: new Date()
    };
    
    socket.current.send(JSON.stringify(payload));
    setMessages(prev => [...prev, { ...payload, isOwn: true }]);
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Link to="/" className="inline-flex items-center gap-2 text-foreground font-bold mb-4 hover:text-skillswap-teal transition-colors">
        <ChevronLeft size={20} /> Voltar para o Feed
      </Link>

      <div className="flex gap-4 h-[calc(100vh-180px)] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        {/* Listagem lateral */}
        <div className="w-80 border-r border-border bg-muted/10 flex flex-col">
          <div className="p-6 border-b border-border bg-background/50">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">💬 Conversas</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((convo) => (
              <div
                key={convo?.id}
                onClick={() => setSelectedConvo(convo)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedConvo?.id === convo?.id ? 'bg-skillswap-teal text-white shadow-lg' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={convo?.user?.avatarUrl} />
                    <AvatarFallback>{convo?.user?.username?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{convo?.user?.username || "Desconhecido"}</p>
                    <p className={`text-xs truncate ${selectedConvo?.id === convo?.id ? 'text-teal-50' : 'text-muted-foreground'}`}>
                      {convo?.lastMessage || "Sem mensagens"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Chat Principal */}
        <div className="flex-1 flex flex-col bg-background/30">
          {selectedConvo ? (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarImage src={selectedConvo?.user?.avatarUrl} /></Avatar>
                  <span className="font-bold">{selectedConvo?.user?.username}</span>
                </div>
                <div className="flex gap-1">
                   <Button variant="ghost" size="icon"><Video size={20}/></Button>
                   <Button variant="ghost" size="icon"><Info size={20}/></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg?.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      msg?.isOwn ? 'bg-skillswap-teal text-white rounded-tr-none' : 'bg-card border border-border rounded-tl-none'
                    }`}>
                      {msg?.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-background border-t border-border flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full"><Plus /></Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Envie uma proposta ou dúvida..."
                  className="flex-1 bg-muted/50 rounded-full border-none focus-visible:ring-skillswap-teal"
                />
                <Button onClick={handleSendMessage} className="bg-skillswap-teal hover:bg-teal-700 rounded-full w-12 h-12">
                  <Send size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
              <span className="text-6xl">✨</span>
              <p className="font-bold">Selecione uma conversa para começar a trocar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;