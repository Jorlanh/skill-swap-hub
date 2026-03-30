import { useEffect, useState } from 'react';
import { FinanceService } from '@/services/api';
import { ChevronLeft, Coins, Receipt, CreditCard, History, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

const financeTabs = ['Nossos planos', 'Cobrança', 'Histórico', 'FAQ'];

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('Nossos planos');
  const [packages, setPackages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [pkgRes, histRes] = await Promise.all([
          FinanceService.getPackages(),
          FinanceService.getHistory()
        ]);
        setPackages(pkgRes.data);
        setHistory(histRes.data);
      } catch (error) {
        console.error("Falha na sincronização financeira:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePurchase = async (pkgId: string) => {
    try {
      await FinanceService.purchase(pkgId);
      toast({
        title: "Transação Aprovada",
        description: "Suas SwapCoins foram injetadas na conta com sucesso.",
      });
      // Recarrega o histórico para mostrar a nova compra
      const { data } = await FinanceService.getHistory();
      setHistory(data);
    } catch (error) {
      toast({
        title: "Falha na Operação",
        description: "Não foi possível processar o pagamento.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-skillswap-teal font-bold transition-colors">
            <ChevronLeft size={20} /> Voltar
          </Link>
          <div className="bg-skillswap-teal/10 text-skillswap-teal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Wallet Ativa
          </div>
        </div>

        <h1 className="font-display font-black text-4xl text-foreground text-center mb-10">SwapCoins</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Menu de Navegação Lateral */}
          <div className="w-full md:w-56 shrink-0 space-y-2">
            {financeTabs.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-skillswap-teal text-white shadow-lg shadow-skillswap-teal/20'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Área de Conteúdo Dinâmico */}
          <div className="flex-1">
            {activeTab === 'Nossos planos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {isLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)
                ) : (
                  packages.map((pkg) => (
                    <div key={pkg.id} className="relative bg-background rounded-3xl border-2 border-border p-8 flex flex-col items-center hover:border-skillswap-teal transition-colors group">
                      {pkg.bonus && (
                        <div className="absolute -top-3 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                          {pkg.bonus}
                        </div>
                      )}
                      
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-skillswap-teal/10 flex items-center justify-center">
                          <Coins className="h-8 w-8 text-skillswap-teal" />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-skillswap-teal flex items-center justify-center -ml-4 border-4 border-background shadow-lg">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <h3 className="font-display font-black text-2xl mb-1">{pkg.amount} SC</h3>
                      <p className="text-muted-foreground font-bold mb-6">R$ {pkg.price.toFixed(2)}</p>
                      
                      <Button 
                        onClick={() => handlePurchase(pkg.id)}
                        className="w-full rounded-full bg-skillswap-teal hover:bg-teal-700 text-white font-black py-6 transition-transform active:scale-95"
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> ADQUIRIR
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'Histórico' && (
              <div className="space-y-3">
                {history.length > 0 ? history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${item.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.description}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-black ${item.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.type === 'CREDIT' ? '+' : '-'}{item.amount} SC
                    </p>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                    <History size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-bold">Sem registros de transação.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;