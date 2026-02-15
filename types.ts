
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  UNMARKED = 'UNMARKED'
}

export enum AbsenceReason {
  FORMATION = 'FOR',
  MALADIE = 'MAL',
  CP = 'CP',
  ANJ = 'ANJ'
}

export const ROLES = [
  'Salarié en insertion',
  'Relais technique',
  'Chef d\'équipe',
  'Cariste'
] as const;

export type Role = typeof ROLES[number];

export interface Member {
  id: string;
  name: string;
  role: Role | string;
  status: AttendanceStatus;
  absenceReason?: AbsenceReason;
  comment?: string;
  signature?: string; // base64 string
  arrivalTime?: string;
  breakStart?: string;
  breakEnd?: string;
  departureTime?: string;
}

export interface Project {
  id: string;
  name: string;
}

export type NavTab = 'home' | 'attendance' | 'teams' | 'settings';
