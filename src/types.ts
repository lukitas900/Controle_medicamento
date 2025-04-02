export interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  instructions: string;
  patientId: string;
}

export interface MedicationAlarm {
  id: string;
  medicationId: string;
  time: string;
  taken: boolean;
}