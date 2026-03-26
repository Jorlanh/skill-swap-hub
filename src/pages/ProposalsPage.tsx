import { useState } from 'react';
import { mockProposals } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle2, XCircle, Ban, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProposalsPage = () => {
  const [selectedProposal, setSelectedProposal] = useState(mockProposals[0]);

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-foreground font-semibold mb-4 hover:opacity-80">
        <ChevronLeft className="h-5 w-5" /> Voltar
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-foreground" />
        <h1 className="font-display font-bold text-2xl text-foreground">Solicitações</h1>
        <span className="bg-skillswap-teal text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          {mockProposals.length}
        </span>
      </div>

      <div className="flex gap-6">
        {/* Proposals list */}
        <div className="w-80 shrink-0 space-y-1">
          {mockProposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                selectedProposal.id === proposal.id
                  ? 'bg-skillswap-light-blue'
                  : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedProposal(proposal)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={proposal.sender.avatar} />
                  <AvatarFallback>{proposal.sender.username[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{proposal.sender.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{proposal.preview}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-skillswap-accept" />
                <XCircle className="h-5 w-5 text-skillswap-reject" />
                <Ban className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Proposal detail */}
        <div className="flex-1 bg-skillswap-card-bg rounded-2xl p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={selectedProposal.sender.avatar} />
              <AvatarFallback>{selectedProposal.sender.username[0]}</AvatarFallback>
            </Avatar>
            <h2 className="font-display font-bold text-xl text-foreground">{selectedProposal.sender.username}</h2>
            <p className="text-sm text-muted-foreground">{selectedProposal.sender.handle}</p>
            <p className="text-sm text-muted-foreground">Na comunidade desde {selectedProposal.sender.joinDate}</p>
          </div>

          <div className="bg-card rounded-xl p-4 mb-6 border border-border">
            <p className="text-sm text-foreground">
              <strong>{selectedProposal.sender.username}</strong> deseja, junto com você, trocar conhecimentos.
              Com interesse em <strong>{selectedProposal.skillWanted}</strong>, {selectedProposal.sender.username} quer poder ajudá-lo com <strong>{selectedProposal.skillOffered}</strong>.
            </p>
          </div>

          <div className="text-center mb-4">
            <span className="text-xs bg-skillswap-light-blue text-foreground px-3 py-1 rounded-full">
              {selectedProposal.date}
            </span>
          </div>

          <div className="space-y-2 mb-8">
            {selectedProposal.message.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="bg-card rounded-xl px-4 py-2 border border-border inline-block">
                <p className="text-sm text-foreground">{line}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button className="bg-skillswap-accept text-primary-foreground hover:opacity-90 flex items-center gap-2 px-6">
              <CheckCircle2 className="h-4 w-4" /> Aceitar
            </Button>
            <Button className="bg-skillswap-reject text-primary-foreground hover:opacity-90 flex items-center gap-2 px-6">
              <XCircle className="h-4 w-4" /> Recusar
            </Button>
            <Button variant="outline" className="flex items-center gap-2 px-6">
              <Ban className="h-4 w-4" /> Bloquear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsPage;
