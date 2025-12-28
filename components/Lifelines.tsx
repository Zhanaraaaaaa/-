
import React from 'react';
import { Users, Phone, HelpCircle } from 'lucide-react';
import { LifelineType } from '../types';

interface LifelinesProps {
  used: {
    fiftyFifty: boolean;
    phoneFriend: boolean;
    askAudience: boolean;
  };
  onUse: (type: LifelineType) => void;
  disabled: boolean;
}

const Lifelines: React.FC<LifelinesProps> = ({ used, onUse, disabled }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onUse(LifelineType.FIFTY_FIFTY)}
        disabled={disabled || used.fiftyFifty}
        className={`p-3 rounded-full border-2 border-yellow-500 transition-all ${
          used.fiftyFifty 
            ? 'opacity-30 grayscale cursor-not-allowed' 
            : 'hover:bg-yellow-500 hover:text-black hover:scale-110 shadow-lg text-yellow-500'
        }`}
        title="50/50"
      >
        <span className="font-bold text-sm">50:50</span>
      </button>

      <button
        onClick={() => onUse(LifelineType.PHONE_FRIEND)}
        disabled={disabled || used.phoneFriend}
        className={`p-3 rounded-full border-2 border-yellow-500 transition-all ${
          used.phoneFriend 
            ? 'opacity-30 grayscale cursor-not-allowed' 
            : 'hover:bg-yellow-500 hover:text-black hover:scale-110 shadow-lg text-yellow-500'
        }`}
        title="Досқа қоңырау шалу"
      >
        <Phone size={20} />
      </button>

      <button
        onClick={() => onUse(LifelineType.ASK_AUDIENCE)}
        disabled={disabled || used.askAudience}
        className={`p-3 rounded-full border-2 border-yellow-500 transition-all ${
          used.askAudience 
            ? 'opacity-30 grayscale cursor-not-allowed' 
            : 'hover:bg-yellow-500 hover:text-black hover:scale-110 shadow-lg text-yellow-500'
        }`}
        title="Көрермендерден көмек"
      >
        <Users size={20} />
      </button>
    </div>
  );
};

export default Lifelines;
