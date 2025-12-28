
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, ArrowRight, RotateCcw, MessageCircle } from 'lucide-react';
import { GameState, LifelineType, Question } from './types';
import { QUESTIONS, PRIZES } from './constants';
import Lifelines from './components/Lifelines';
import PrizeLadder from './components/PrizeLadder';
import { getAILifelineResponse } from './services/gemini';

const App: React.FC = () => {
  const [game, setGame] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    status: 'IDLE',
    selectedOption: null,
    lifelines: {
      fiftyFifty: false,
      phoneFriend: false,
      askAudience: false,
    },
    prizes: PRIZES,
  });

  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentQuestion = QUESTIONS[game.currentQuestionIndex];

  const startGame = () => {
    setGame({
      currentQuestionIndex: 0,
      score: 0,
      status: 'PLAYING',
      selectedOption: null,
      lifelines: {
        fiftyFifty: false,
        phoneFriend: false,
        askAudience: false,
      },
      prizes: PRIZES,
    });
    setRemovedOptions([]);
    setAiMessage(null);
  };

  const handleOptionClick = (index: number) => {
    if (game.status !== 'PLAYING' || removedOptions.includes(index)) return;

    setGame(prev => ({ ...prev, selectedOption: index, status: 'ANSWER_CHECKING' }));

    setTimeout(() => {
      if (index === currentQuestion.answerIndex) {
        if (game.currentQuestionIndex === QUESTIONS.length - 1) {
          setGame(prev => ({ ...prev, status: 'WON' }));
        } else {
          // Success! Next question after a delay
          setTimeout(() => {
            setGame(prev => ({
              ...prev,
              currentQuestionIndex: prev.currentQuestionIndex + 1,
              status: 'PLAYING',
              selectedOption: null,
            }));
            setRemovedOptions([]);
            setAiMessage(null);
          }, 1500);
        }
      } else {
        setGame(prev => ({ ...prev, status: 'LOST' }));
      }
    }, 1500);
  };

  const useLifeline = async (type: LifelineType) => {
    if (game.lifelines[type] || game.status !== 'PLAYING') return;

    setGame(prev => ({
      ...prev,
      lifelines: { ...prev.lifelines, [type]: true },
    }));

    if (type === LifelineType.FIFTY_FIFTY) {
      const wrongIndices = currentQuestion.options
        .map((_, i) => i)
        .filter(i => i !== currentQuestion.answerIndex);
      const toRemove = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
      setRemovedOptions(toRemove);
    } else if (type === LifelineType.PHONE_FRIEND) {
      setIsAiLoading(true);
      const msg = await getAILifelineResponse(currentQuestion, 'phone');
      setAiMessage(msg);
      setIsAiLoading(false);
    } else if (type === LifelineType.ASK_AUDIENCE) {
      setIsAiLoading(true);
      const msg = await getAILifelineResponse(currentQuestion, 'audience');
      setAiMessage(msg);
      setIsAiLoading(false);
    }
  };

  const renderOption = (option: string, index: number) => {
    const isSelected = game.selectedOption === index;
    const isCorrect = index === currentQuestion.answerIndex;
    const isRemoved = removedOptions.includes(index);
    const label = String.fromCharCode(65 + index); // A, B, C, D

    let baseClasses = "relative flex items-center w-full p-4 md:p-6 border-2 rounded-xl transition-all duration-300 text-left group overflow-hidden ";
    
    if (isRemoved) {
      return <div key={index} className="invisible pointer-events-none"></div>;
    }

    if (game.status === 'ANSWER_CHECKING' && isSelected) {
      baseClasses += "bg-yellow-500 border-yellow-300 text-black scale-105 z-10 animate-pulse ";
    } else if (game.status === 'WON' || (game.status === 'LOST' && isCorrect)) {
      baseClasses += "bg-green-500 border-green-300 text-white z-10 ";
    } else if (game.status === 'LOST' && isSelected) {
      baseClasses += "bg-red-500 border-red-300 text-white z-10 ";
    } else {
      baseClasses += "bg-blue-900/40 border-yellow-600/40 text-yellow-50 hover:bg-yellow-600/20 hover:border-yellow-500 cursor-pointer ";
    }

    return (
      <button
        key={index}
        onClick={() => handleOptionClick(index)}
        disabled={game.status !== 'PLAYING'}
        className={baseClasses}
      >
        <span className="text-yellow-500 font-bold mr-4 group-hover:text-white transition-colors">
          {label}:
        </span>
        <span className="font-semibold text-lg">{option}</span>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    );
  };

  if (game.status === 'IDLE') {
    return (
      <div className="min-h-screen bg-millionaire-gradient flex flex-col items-center justify-center p-4 text-center">
        <div className="relative mb-8">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-blue-900 border-8 border-yellow-600 shadow-[0_0_50px_rgba(234,179,8,0.4)] flex items-center justify-center animate-bounce-slow">
            <Trophy className="text-yellow-500" size={100} />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-600 px-6 py-2 rounded-full font-bold text-white shadow-xl whitespace-nowrap">
            5 000 000 ₸
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 mb-4 drop-shadow-2xl">
          МИЛЛИОН КІМГЕ БҰЙЫРАДЫ?
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 mb-12 font-medium">
          Сөз таптары бойынша интеллектуалды ойын
        </p>
        <button
          onClick={startGame}
          className="group relative inline-flex items-center gap-3 px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-2xl rounded-2xl shadow-[0_10px_0_rgb(161,98,7)] active:translate-y-2 active:shadow-none transition-all"
        >
          ОЙЫНДЫ БАСТАУ
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    );
  }

  if (game.status === 'WON') {
    return (
      <div className="min-h-screen bg-millionaire-gradient flex flex-col items-center justify-center p-4 text-center">
        <Trophy className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]" size={150} />
        <h1 className="text-6xl font-black text-white mb-2">ҚҰТТЫҚТАЙМЫЗ!</h1>
        <p className="text-3xl text-yellow-500 font-bold mb-8">СІЗ МИЛЛИОНЕРСІЗ!</p>
        <div className="text-5xl font-black text-white bg-green-600/50 px-12 py-6 rounded-3xl border-4 border-white/30 backdrop-blur-lg mb-12 animate-pulse">
          5 000 000 ₸
        </div>
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold text-xl rounded-xl hover:bg-blue-50 transition-colors shadow-2xl"
        >
          <RotateCcw /> ҚАЙТА ОЙНАУ
        </button>
      </div>
    );
  }

  if (game.status === 'LOST') {
    const prizeWon = game.currentQuestionIndex >= 10 ? PRIZES[9] : (game.currentQuestionIndex >= 5 ? PRIZES[4] : "0 ₸");
    return (
      <div className="min-h-screen bg-millionaire-gradient flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-600/20 border-2 border-red-500/50 p-12 rounded-3xl backdrop-blur-xl max-w-lg w-full">
          <h2 className="text-5xl font-black text-white mb-4">ОЙЫН АЯҚТАЛДЫ</h2>
          <p className="text-xl text-red-200 mb-8">Дұрыс жауап: <span className="font-bold text-green-400">{currentQuestion.options[currentQuestion.answerIndex]}</span></p>
          <div className="bg-black/40 p-6 rounded-2xl mb-8 border border-white/10">
            <p className="text-blue-200 text-sm mb-1 uppercase tracking-widest">Сіздің ұтысыңыз:</p>
            <p className="text-4xl font-black text-yellow-500">{prizeWon}</p>
          </div>
          <button
            onClick={startGame}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
          >
            <RotateCcw /> ҚАЙТА БАСТАУ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-millionaire-gradient relative overflow-hidden flex flex-col">
      {/* Top Bar: Progress & Lifelines */}
      <div className="flex justify-between items-center p-4 lg:p-8">
        <div className="flex flex-col">
          <span className="text-yellow-600 text-sm font-bold uppercase tracking-widest">Сұрақ {game.currentQuestionIndex + 1} / 15</span>
          <span className="text-white text-2xl font-black">{PRIZES[game.currentQuestionIndex]}</span>
        </div>
        
        <Lifelines 
          used={game.lifelines} 
          onUse={useLifeline} 
          disabled={game.status !== 'PLAYING'} 
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-20 gap-12">
        {/* Main Game Area */}
        <div className="flex-1 w-full max-w-4xl flex flex-col gap-8">
          
          {/* AI Lifeline Display */}
          {(aiMessage || isAiLoading) && (
            <div className="bg-blue-600/40 border-2 border-blue-400 p-6 rounded-2xl animate-in slide-in-from-top fade-in duration-500 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2 text-blue-200">
                <MessageCircle size={20} className="animate-pulse" />
                <span className="font-bold text-sm uppercase">Көмек:</span>
              </div>
              {isAiLoading ? (
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              ) : (
                <p className="text-white font-medium leading-relaxed italic">"{aiMessage}"</p>
              )}
            </div>
          )}

          {/* Question Box */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-blue-900/60 border-2 border-yellow-600/50 p-8 md:p-12 rounded-2xl text-center shadow-2xl backdrop-blur-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                {currentQuestion.text}
              </h2>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {currentQuestion.options.map((option, idx) => renderOption(option, idx))}
          </div>
        </div>

        {/* Prize Ladder Side Bar */}
        <PrizeLadder currentLevel={game.currentQuestionIndex} />
      </div>

      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
    </div>
  );
};

export default App;
