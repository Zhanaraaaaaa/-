
import React from 'react';
import { PRIZES } from '../constants';

interface PrizeLadderProps {
  currentLevel: number;
}

const PrizeLadder: React.FC<PrizeLadderProps> = ({ currentLevel }) => {
  return (
    <div className="hidden lg:flex flex-col-reverse gap-1 bg-black/40 p-6 rounded-xl border-2 border-yellow-600/50 backdrop-blur-md">
      {PRIZES.map((prize, index) => {
        const isActive = index === currentLevel;
        const isPast = index < currentLevel;
        const isSafePoint = (index + 1) % 5 === 0;

        return (
          <div
            key={index}
            className={`flex justify-between items-center px-4 py-1 rounded transition-all duration-300 ${
              isActive 
                ? 'bg-yellow-500 text-black font-bold scale-105 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                : isSafePoint ? 'text-white' : 'text-yellow-600'
            } ${isPast ? 'opacity-40' : 'opacity-100'}`}
          >
            <span className="text-xs font-mono mr-4">{index + 1}</span>
            <span className="text-sm font-bold">{prize}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PrizeLadder;
