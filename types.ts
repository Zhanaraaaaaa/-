
export interface Question {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  level: number;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  status: 'IDLE' | 'PLAYING' | 'WON' | 'LOST' | 'ANSWER_CHECKING';
  selectedOption: number | null;
  lifelines: {
    fiftyFifty: boolean;
    phoneFriend: boolean;
    askAudience: boolean;
  };
  prizes: string[];
}

export enum LifelineType {
  FIFTY_FIFTY = 'fiftyFifty',
  PHONE_FRIEND = 'phoneFriend',
  ASK_AUDIENCE = 'askAudience'
}
