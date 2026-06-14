import { create } from 'zustand';

interface SessionState {
  trainNumber: string;
  coachNumber: string;
  setSession: (trainNumber: string, coachNumber: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  trainNumber: '',
  coachNumber: '',
  setSession: (trainNumber, coachNumber) => set({ trainNumber, coachNumber }),
  clearSession: () => set({ trainNumber: '', coachNumber: '' }),
}));
