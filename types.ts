import { FHIR_Observation, FHIR_MedicationRequest } from './fhir-types';

export enum Role {
    Patient = 'Patient',
    Doctor = 'Doctor',
    Auditor = 'Auditor',
    Researcher = 'Researcher',
}

export enum Language {
    English = 'en',
    Hindi = 'hi',
    Kannada = 'kn',
}

export enum Page {
    Dashboard = 'Dashboard',
    HealthRecord = 'HealthRecord',
    PatientAnalysis = 'PatientAnalysis',
    AiChatbot = 'AiChatbot',
    FindDoctor = 'FindDoctor',
    HealthSchemes = 'HealthSchemes',
    FemaleHealth = 'FemaleHealth',
    AuditTrail = 'AuditTrail',
    ResearchData = 'ResearchData',
    HowItWorks = 'HowItWorks',
}

export interface User {
    id: string;
    name: string;
    role: Role;
    aadhar?: string;
    secretCode?: string; // For login
}

export interface Block<T> {
    hash: string;
    previousHash: string;
    timestamp: number;
    data: T;
}

// Data stored on the blockchain (reference to off-chain data)
export interface HealthRecordRef {
    recordHash: string;
    timestamp: number;
    patientId: string;
    doctorId: string;
}

// The detailed health record stored off-chain
export interface HealthRecord {
    id: string; // This will be the hash
    patient: {
        id: string;
        name: string;
    };
    doctor: {
        id: string;
        name: string;
    };
    hospital: string;
    timestamp: number;
    entry: (FHIR_Observation | FHIR_MedicationRequest)[];
}

export interface AccessGrant {
    patientId: string;
    doctorId: string;
    expiryTimestamp: number;
}

export interface HealthScheme {
    name: string;
    description: string;
    benefits: string[];
    eligibility: string;
    applicationLink: string;
}

export interface DoctorInfo {
    name: string;
    specialty: string;
    clinic: string;
    address: string;
    phone: string;
}

export interface FemaleHealthAnalysis {
    nextPeriod: string;
    fertileWindow: string;
    currentPhase: {
        name: string;
        insights: string;
    };
    healthTips: string[];
    disclaimer: string;
}

// For audit trail
export interface AuditLog {
    id: string;
    timestamp: number;
    accessorId: string;
    accessorName: string;
    accessorRole: Role;
    patientId: string;
    action: 'VIEW_RECORD' | 'GRANT_ACCESS' | 'REVOKE_ACCESS' | 'LOGIN_SUCCESS' | 'LOGIN_FAIL';
    details: string; 
}
