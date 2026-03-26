import { mockSwapCoinPackages } from '@/data/mockData';
import { ChevronLeft, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const financeTabs = ['Nossos planos', 'Cobrança', 'Histórico', 'Entre usuários', 'FAQ'];

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('Nossos planos');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-skillswap-card-bg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="inline-flex items-center gap-1 text-foreground font-semibold hover:opacity-80">
            <ChevronLeft className="h-5 w-5" /> Voltar
          </Link>
        </div>
        <h1 className="font-display font-bold text-3xl text-foreground text-center mb-6">SwapCoins</h1>

        <div className="flex gap-6">
          {/* Tabs */}
          <div className="w-44 shrink-0 space-y-2">
            {financeTabs.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-skillswap-light-blue text-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Packages */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {mockSwapCoinPackages.map((pkg) => (
              <div key={pkg.id} className="bg-card rounded-xl border border-border p-6 flex flex-col items-center">
                <h3 className="font-display font-bold text-foreground mb-3">Qnt moedas</h3>
                <div className="flex items-center gap-1 mb-4">
                  <div className="w-12 h-12 rounded-full bg-skillswap-light-blue flex items-center justify-center">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/70 flex items-center justify-center -ml-3">
                    <Coins className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                {pkg.bonus && (
                  <p className="text-xs text-muted-foreground mb-1">{pkg.bonus}</p>
                )}
                <p className="font-bold text-foreground mb-3">{pkg.price}</p>
                <Button variant="outline" size="sm" className="bg-skillswap-light-blue border-border text-foreground hover:bg-accent">
                  Comprar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
