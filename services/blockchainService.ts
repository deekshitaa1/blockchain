import { User, Role, HealthRecord, HealthRecordRef, Block, AccessGrant, AuditLog } from '../types';

// Simple hashing function for demonstration. In a real app, use a robust library like SHA256.
const simpleHash = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
};


// --- MOCK DATABASE ---
const mockUsers: User[] = [
    { id: 'patient_01', name: 'Rohan Sharma', role: Role.Patient, aadhar: '111122223333', secretCode: 'pass1' },
    { id: 'patient_02', name: 'Priya Patel', role: Role.Patient, aadhar: '444455556666', secretCode: 'pass2' },
    { id: 'doctor_01', name: 'Dr. Anjali Rao', role: Role.Doctor, aadhar: '777788889999', secretCode: 'doc1' },
    { id: 'doctor_02', name: 'Dr. Vikram Singh', role: Role.Doctor, aadhar: '101010101010', secretCode: 'doc2' },
    { id: 'auditor_01', name: 'Sunita Gupta', role: Role.Auditor, aadhar: '121212121212', secretCode: 'audit1' },
    { id: 'researcher_01', name: 'Amit Kumar', role: Role.Researcher, aadhar: '131313131313', secretCode: 'res1' },
];

const mockHealthRecords: { [hash: string]: HealthRecord } = {
    "rec_hash_01": { id: "rec_hash_01", patient: {id: 'patient_01', name: 'Rohan Sharma'}, doctor: {id: 'doctor_01', name: 'Dr. Anjali Rao'}, hospital: 'City Hospital', timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, entry: [{ resourceType: 'Observation', status: 'final', code: { text: 'Viral Fever' }, subject: { reference: 'Patient/patient_01' }, valueString: "High temperature, fatigue, headache." }] },
    "rec_hash_02": { id: "rec_hash_02", patient: {id: 'patient_01', name: 'Rohan Sharma'}, doctor: {id: 'doctor_01', name: 'Dr. Anjali Rao'}, hospital: 'City Hospital', timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, entry: [{ resourceType: 'MedicationRequest', status: 'active', intent: 'order', medicationCodeableConcept: { text: 'Paracetamol 500mg, twice a day for 3 days' }, subject: { reference: 'Patient/patient_01' } }] },
    "rec_hash_03": { id: "rec_hash_03", patient: {id: 'patient_02', name: 'Priya Patel'}, doctor: {id: 'doctor_02', name: 'Dr. Vikram Singh'}, hospital: 'General Clinic', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, entry: [{ resourceType: 'Observation', status: 'final', code: { text: 'Common Cold' }, subject: { reference: 'Patient/patient_02' }, valueString: "Sore throat and runny nose." }] },
};

// MOCK BLOCKCHAINS per patient
const blockchains: { [patientId: string]: Block<HealthRecordRef>[] } = {};
const accessGrants: AccessGrant[] = [];
const auditLogs: AuditLog[] = [];

// --- HELPER TO INITIALIZE BLOCKCHAIN ---
const initializeChain = (patientId: string) => {
    if (!blockchains[patientId]) {
        const genesisBlock: Block<HealthRecordRef> = { hash: 'genesis_hash', previousHash: '0', timestamp: Date.now(), data: { recordHash: 'genesis_record', timestamp: Date.now(), patientId, doctorId: 'system' } };
        blockchains[patientId] = [genesisBlock];

        // Add some records for the mock patients
        if (patientId === 'patient_01') {
            addBlock('patient_01', 'doctor_01', 'rec_hash_01');
            addBlock('patient_01', 'doctor_01', 'rec_hash_02');
        } else if (patientId === 'patient_02') {
            addBlock('patient_02', 'doctor_02', 'rec_hash_03');
        }
    }
};

const addBlock = (patientId: string, doctorId: string, recordHash: string) => {
    const chain = blockchains[patientId];
    if (!chain) return;
    const previousBlock = chain[chain.length - 1];
    const newBlockData: HealthRecordRef = { recordHash, timestamp: Date.now(), patientId, doctorId };
    const newBlock: Block<HealthRecordRef> = {
        previousHash: previousBlock.hash,
        timestamp: Date.now(),
        data: newBlockData,
        hash: simpleHash(JSON.stringify(newBlockData) + previousBlock.hash),
    };
    chain.push(newBlock);
};

// Initialize chains for mock users
mockUsers.filter(u => u.role === Role.Patient).forEach(p => initializeChain(p.id));


// --- LOGGING ---
const logAction = (accessor: User, patientId: string, action: AuditLog['action'], details: string) => {
    auditLogs.push({
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        accessorId: accessor.id,
        accessorName: accessor.name,
        accessorRole: accessor.role,
        patientId,
        action,
        details,
    });
};

// --- EXPORTED API ---

export const authenticateUser = (aadhar: string, secretCode: string): User | null => {
    const user = mockUsers.find(u => u.aadhar === aadhar && u.secretCode === secretCode);
    if (user) {
        logAction(user, user.id, 'LOGIN_SUCCESS', 'User logged in successfully.');
        return user;
    }
    const failedUserAttempt = mockUsers.find(u => u.aadhar === aadhar);
    logAction(
        failedUserAttempt || { id: 'unknown', name: `Unknown (${aadhar})`, role: Role.Patient }, 
        failedUserAttempt?.id || 'unknown', 
        'LOGIN_FAIL', 
        'Failed login attempt.'
    );
    return null;
};

export const getHealthChain = (patientId: string, requester: User): Block<HealthRecordRef>[] | null => {
    // In a real system, there would be rules about who can see the chain itself.
    // For this demo, we allow it for simplicity.
    initializeChain(patientId);
    return blockchains[patientId] || null;
};

export const getHealthRecord = (recordHash: string, patientId: string, requester: User): HealthRecord | null => {
    const hasPermission = requester.id === patientId || requester.role === Role.Auditor;
    const grant = accessGrants.find(g => g.patientId === patientId && g.doctorId === requester.id && g.expiryTimestamp > Date.now());
    
    if (hasPermission || grant) {
        logAction(requester, patientId, 'VIEW_RECORD', `Accessed record hash: ${recordHash.substring(0, 15)}...`);
        return mockHealthRecords[recordHash] || null;
    }
    
    return null;
};

export const grantAccess = (patientId: string, doctorId: string, durationHours: number): void => {
    const patient = mockUsers.find(u => u.id === patientId && u.role === Role.Patient);
    if(!patient) return;

    revokeAccess(patientId, doctorId); // Remove existing grant first
    const expiryTimestamp = Date.now() + durationHours * 60 * 60 * 1000;
    accessGrants.push({ patientId, doctorId, expiryTimestamp });
    const doctor = mockUsers.find(u=>u.id === doctorId);
    logAction(patient, patientId, 'GRANT_ACCESS', `Granted access to ${doctor?.name || doctorId} for ${durationHours} hours.`);
};

export const revokeAccess = (patientId: string, doctorId: string): void => {
    const patient = mockUsers.find(u => u.id === patientId && u.role === Role.Patient);
    if(!patient) return;

    const index = accessGrants.findIndex(g => g.patientId === patientId && g.doctorId === doctorId);
    if (index > -1) {
        accessGrants.splice(index, 1);
        const doctor = mockUsers.find(u=>u.id === doctorId);
        logAction(patient, patientId, 'REVOKE_ACCESS', `Revoked access for ${doctor?.name || doctorId}.`);
    }
};

export const getAccessStatus = (patientId: string, doctorId: string): AccessGrant | undefined => {
    return accessGrants.find(g => g.patientId === patientId && g.doctorId === doctorId && g.expiryTimestamp > Date.now());
};

export const getAllGrantsForPatient = (patientId: string): AccessGrant[] => {
    return accessGrants.filter(g => g.patientId === patientId && g.expiryTimestamp > Date.now());
};

export const getDoctors = (): User[] => {
    return mockUsers.filter(u => u.role === Role.Doctor);
};

export const getAuditTrail = (requester: User): AuditLog[] | null => {
    if (requester.role === Role.Auditor) {
        // Return logs sorted by most recent first
        return [...auditLogs].sort((a, b) => b.timestamp - a.timestamp);
    }
    return null;
};

export const getAnonymizedData = (requester: User): any | null => {
    if (requester.role !== Role.Researcher) return null;

    const diseaseCounts: Record<string, number> = {};
    Object.values(mockHealthRecords).forEach(record => {
        const diagnosis = record.entry.find(e => e.resourceType === 'Observation');
        if (diagnosis && 'code' in diagnosis) {
            const disease = diagnosis.code.text;
            diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
        }
    });

    return Object.entries(diseaseCounts).map(([name, value]) => ({ name, value }));
};
