import React, { useState, useEffect } from 'react';
import { User, Language, Block, HealthRecordRef, HealthRecord, Role, AccessGrant } from '../types';
import * as blockchain from '../services/blockchainService';
import Card from './common/Card';
import { translateText } from '../services/geminiService';
import { ClockIcon, KeyIcon, LockClosedIcon } from './icons';

interface HealthRecordProps {
    user: User;
    language: Language;
}

const HealthRecordPage: React.FC<HealthRecordProps> = ({ user, language }) => {
    const patientId = user.role === Role.Patient ? user.id : 'patient_01'; // Demo purpose: doctor views patient_01
    const [chain, setChain] = useState<Block<HealthRecordRef>[] | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
    const [isLoadingRecord, setIsLoadingRecord] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [grants, setGrants] = useState<AccessGrant[]>([]);
    const [doctors, setDoctors] = useState<User[]>([]);

    const [translatedText, setTranslatedText] = useState({
        title: "Patient Health Records",
        subtitle: "A secure, chronological view of your medical history.",
        recordLogTitle: "Record History (On-Chain References)",
        recordDetailsTitle: "Record Details (Secure Off-Chain Data)",
        accessManagementTitle: "Access Management Console",
        grantAccess: "Grant Access",
        revoke: "Revoke",
        accessGrantedTo: "Access Granted To",
        expiresIn: "Expires in",
        noRecords: "No health records found.",
        selectRecord: "Select a record from the history to view details.",
        loadingRecord: "Decrypting and fetching record...",
        accessDenied: "Access Denied. You do not have permission to view this record.",
    });

    const fetchChainAndGrants = () => {
        const records = blockchain.getHealthChain(patientId, user);
        setChain(records);
        if (user.role === Role.Patient) {
            setGrants(blockchain.getAllGrantsForPatient(patientId));
            setDoctors(blockchain.getDoctors());
        }
    };

    useEffect(() => {
        fetchChainAndGrants();
    }, [patientId, user]);

    useEffect(() => {
        const translate = async () => {
            // This is a simplified translation, in a real app you might need more dynamic translations
            setTranslatedText({
                title: await translateText("Patient Health Records", language),
                subtitle: await translateText("A secure, chronological view of your medical history.", language),
                recordLogTitle: await translateText("Record History (On-Chain References)", language),
                recordDetailsTitle: await translateText("Record Details (Secure Off-Chain Data)", language),
                accessManagementTitle: await translateText("Access Management Console", language),
                grantAccess: await translateText("Grant Access", language),
                revoke: await translateText("Revoke", language),
                accessGrantedTo: await translateText("Access Granted To", language),
                expiresIn: await translateText("Expires in", language),
                noRecords: await translateText("No health records found.", language),
                selectRecord: await translateText("Select a record from the history to view details.", language),
                loadingRecord: await translateText("Decrypting and fetching record...", language),
                accessDenied: await translateText("Access Denied. You do not have permission to view this record.", language),
            });
        };
        translate();
    }, [language]);


    const handleSelectRecord = (recordRef: HealthRecordRef) => {
        setIsLoadingRecord(true);
        setAccessDenied(false);
        setSelectedRecord(null);

        setTimeout(() => { // Simulate network delay
            const record = blockchain.getHealthRecord(recordRef.recordHash, patientId, user);
            if (record) {
                setSelectedRecord(record);
            } else {
                setAccessDenied(true);
            }
            setIsLoadingRecord(false);
        }, 500);
    };
    
    const handleGrantAccess = (doctorId: string) => {
        blockchain.grantAccess(patientId, doctorId, 24); // Grant 24-hour access
        fetchChainAndGrants(); // Refresh grants
    };

    const handleRevokeAccess = (doctorId: string) => {
        blockchain.revokeAccess(patientId, doctorId);
        fetchChainAndGrants(); // Refresh grants
    };

    const formatTimeLeft = (expiry: number) => {
        const diff = expiry - Date.now();
        if (diff <= 0) return "Expired";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const recordsToDisplay = chain ? chain.slice(1).reverse() : [];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-100">{translatedText.title}</h1>
                <p className="text-slate-400 mt-2">{translatedText.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Record History */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-pink-400 mb-4">{translatedText.recordLogTitle}</h2>
                    <Card className="max-h-[70vh] overflow-y-auto">
                        {recordsToDisplay.length > 0 ? (
                            <div className="space-y-3">
                                {recordsToDisplay.map(block => (
                                    <div key={block.hash} onClick={() => handleSelectRecord(block.data)} className={`p-3 rounded-lg cursor-pointer transition border border-transparent ${selectedRecord?.id === block.data.recordHash ? 'bg-slate-700 border-pink-500' : 'bg-slate-800 hover:bg-slate-700/50'}`}>
                                        <p className="font-semibold text-slate-200">Record from {new Date(block.timestamp).toLocaleDateString()}</p>
                                        <p className="text-xs text-slate-400 font-mono truncate">Hash: {block.data.recordHash}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p>{translatedText.noRecords}</p>}
                    </Card>
                </div>

                {/* Column 2: Record Details / Access Management */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-pink-400 mb-4">{translatedText.recordDetailsTitle}</h2>
                    <Card className="min-h-[300px]">
                        {isLoadingRecord ? <p>{translatedText.loadingRecord}</p> :
                         accessDenied ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <LockClosedIcon className="w-16 h-16 text-red-400 mb-4" />
                                <p className="text-xl font-bold text-red-400">{translatedText.accessDenied}</p>
                            </div>
                         ) :
                         selectedRecord ? <RecordDetails record={selectedRecord} /> :
                         <p className="text-slate-400">{translatedText.selectRecord}</p>
                        }
                    </Card>
                    
                    {user.role === Role.Patient && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-pink-400 mb-4">{translatedText.accessManagementTitle}</h2>
                            <Card>
                                <div className="space-y-4">
                                    {doctors.map(doctor => {
                                        const grant = grants.find(g => g.doctorId === doctor.id);
                                        return (
                                            <div key={doctor.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-slate-100">{doctor.name}</p>
                                                    {grant ? (
                                                        <div className="flex items-center text-xs text-green-400">
                                                            <ClockIcon className="w-4 h-4 mr-1"/>
                                                            {translatedText.expiresIn} {formatTimeLeft(grant.expiryTimestamp)}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400">No Access</p>
                                                    )}
                                                </div>
                                                {grant ? (
                                                    <button onClick={() => handleRevokeAccess(doctor.id)} className="bg-red-600 text-white font-bold text-sm py-1 px-3 rounded-lg hover:bg-red-700 transition">{translatedText.revoke}</button>
                                                ) : (
                                                    <button onClick={() => handleGrantAccess(doctor.id)} className="bg-green-600 text-white font-bold text-sm py-1 px-3 rounded-lg hover:bg-green-700 transition flex items-center"><KeyIcon className="w-4 h-4 mr-1"/>{translatedText.grantAccess}</button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RecordDetails: React.FC<{ record: HealthRecord }> = ({ record }) => {
    const diagnosis = record.entry.find(e => e.resourceType === 'Observation');
    const prescription = record.entry.find(e => e.resourceType === 'MedicationRequest');

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Date:</strong> {new Date(record.timestamp).toLocaleString()}</p>
                <p><strong>Hospital:</strong> {record.hospital}</p>
                <p><strong>Doctor:</strong> {record.doctor.name}</p>
            </div>
            {diagnosis && 'code' in diagnosis && (
                <div>
                    <h3 className="font-bold text-lg text-slate-200 border-b border-slate-700 pb-1 mb-2">Diagnosis</h3>
                    <p><strong>Condition:</strong> {diagnosis.code.text}</p>
                    { 'valueString' in diagnosis && <p><strong>Symptoms/Notes:</strong> {diagnosis.valueString}</p> }
                </div>
            )}
            {prescription && 'medicationCodeableConcept' in prescription && (
                 <div>
                    <h3 className="font-bold text-lg text-slate-200 border-b border-slate-700 pb-1 mb-2">Prescription</h3>
                    <p>{prescription.medicationCodeableConcept.text}</p>
                </div>
            )}
        </div>
    )
}

export default HealthRecordPage;
