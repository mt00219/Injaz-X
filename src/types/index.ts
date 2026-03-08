export type Language = "ar" | "en";

export type NoteStatus =
  | "PENDING"
  | "ACTIVE"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "REJECTED";

export type UserType = "INDIVIDUAL" | "COMPANY" | "BANK";

export type NotePurpose =
  | "COMMERCIAL"
  | "PERSONAL"
  | "REAL_ESTATE"
  | "EDUCATION"
  | "VEHICLE"
  | "OTHER";

export interface NoteWithParties {
  id: string;
  noteNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  issueDate: string;
  description?: string | null;
  purpose?: string | null;
  status: NoteStatus;
  creditor: { id: string; name: string; nationalId: string; userType: string };
  debtor?: { id: string; name: string; nationalId: string; userType: string } | null;
  debtorNationalId?: string | null;
  signedAt?: string | null;
  paidAt?: string | null;
  history?: NoteHistoryItem[];
  createdAt: string;
}

export interface NoteHistoryItem {
  id: string;
  action: string;
  details?: string | null;
  actorName?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalNotes: number;
  activeNotes: number;
  pendingNotes: number;
  overdueNotes: number;
  paidNotes: number;
  totalAmountIssued: number;
  totalAmountPaid: number;
  monthlyData: { month: string; issued: number; paid: number; amount: number }[];
}
