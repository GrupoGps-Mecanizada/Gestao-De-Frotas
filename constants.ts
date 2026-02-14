import { StatusType } from "./types";

// URL Atualizada conforme o script Tampermonkey fornecido
export const GAS_URL = 'https://script.google.com/macros/s/AKfycbyMoOEk0_m6CjqvPZcC6LaMtv_V9Ef5r8XbH8j-ioiuM7_B3NooUTYjiqSNchxuf1w9nw/exec'; 

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  trabalhando: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-500', icon: 'bg-emerald-500' },
  parado: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500', icon: 'bg-red-500' },
  manutencao: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-500', icon: 'bg-amber-500' },
  'sem-apropriacao': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-400', icon: 'bg-slate-400' }
};

export const STATUS_LABELS: Record<string, string> = {
  trabalhando: 'Em Operação',
  parado: 'Parado',
  manutencao: 'Em Manutenção',
  'sem-apropriacao': 'Sem Sinal'
};

export const normalizeStatus = (rawStatus: string): StatusType => {
  const s = rawStatus?.toLowerCase() || '';
  if (s.includes('trabalhando') || s.includes('ligado') || s.includes('operando')) return 'trabalhando';
  if (s.includes('parado') || s.includes('desligado')) return 'parado';
  if (s.includes('manutenção') || s.includes('manutencao')) return 'manutencao';
  return 'sem-apropriacao';
};

// Formatação estrita para: 00:00 13/02/2026
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '--:-- --/--/----';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Tenta limpar formato de string do Google Sheets se necessário
        return dateString.replace('GMT-0300 (Horário Padrão de Brasília)', '').substring(0, 16); 
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch (e) {
    return dateString;
  }
};

/**
 * Converte string "HH:mm" em minutos totais do dia
 */
export const timeToMinutes = (timeStr: string): number => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
};

/**
 * Calcula a diferença entre dois horários "HH:mm" e retorna string formatada "HH:mm"
 */
export const calculateDuration = (startStr: string, endStr: string): string => {
    const startMins = timeToMinutes(startStr);
    const endMins = timeToMinutes(endStr);
    
    let diff = endMins - startMins;
    if (diff < 0) diff += 1440; // Trata virada do dia (24h * 60)

    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};