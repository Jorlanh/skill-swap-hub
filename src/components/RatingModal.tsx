import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RatingStars from '@/components/RatingStars';
import VerifiedBadge from '@/components/VerifiedBadge';
import type { User } from '@/types';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  proposalId: string;
  onSubmit?: (data: { proposalId: string; stars: number; comment: string }) => void;
}

const RatingModal = ({ open, onOpenChange, user, proposalId, onSubmit }: RatingModalProps) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ proposalId, stars, comment });
    setStars(0);
    setComment('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-center">Avaliar Troca</DialogTitle>
          <DialogDescription className="text-center">Como foi sua experiência?</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-lg text-foreground">{user.username}</h3>
            {user.isVerified && <VerifiedBadge size={16} />}
          </div>

          <RatingStars value={stars} onChange={setStars} size={32} />

          <Textarea
            placeholder="Deixe um comentário (opcional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />

          <Button
            onClick={handleSubmit}
            disabled={stars === 0}
            className="w-full"
          >
            Submeter Avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
