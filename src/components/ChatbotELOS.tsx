import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { ChatbotService } from '@/services/api'; // Certifique-se que o alias @ aponta para src/
import { Bot, Send, BrainCircuit, X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

// Definição de interface para o histórico de chat
interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export const ChatbotELOS: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [simplify, setSimplify] = useState<boolean>(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const userMsg = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const { data } = await ChatbotService.ask(userMsg, simplify);
      setHistory(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'bot', text: "Erro na conexão com o MIND-ELOS. Verifique o backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg bg-skillswap-teal">
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <div className="w-80 h-[450px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-skillswap-teal p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-bold">MIND-ELOS v1.0</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-teal-700 text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {history.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  chat.role === 'user' ? 'bg-skillswap-teal text-white rounded-tr-none' : 'bg-card border text-foreground rounded-tl-none'
                }`}>
                  {chat.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-card space-y-3">
            <div className="flex items-center space-x-2">
              <Switch id="mode-elos" checked={simplify} onCheckedChange={setSimplify} />
              <Label htmlFor="mode-elos" className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <BrainCircuit className="h-3 w-3" /> Modo Acessibilidade
              </Label>
            </div>
            <div className="flex gap-2">
              <Input 
                value={message} 
                onChange={handleInputChange}
                placeholder="Pergunte ao ELOS..."
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSend} disabled={isLoading} className="bg-skillswap-teal">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};