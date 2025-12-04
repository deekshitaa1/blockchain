import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { Language, Block, HealthRecordRef, HealthRecord, User, Role } from '../types';
import { translateText } from '../services/geminiService';
import * as blockchain from '../services/blockchainService';
import { CpuChipIcon, CubeTransparentIcon, DatabaseIcon, KeyIcon, LockClosedIcon, LockOpenIcon, ArrowRightIcon } from './icons';

interface HowItWorksProps {
    language: Language;
}

const DEMO_PATIENT_ID = 'patient_01';
const DEMO_DOCTOR: User = { id: 'doctor_01', name: 'Dr. Anjali Rao', role: Role.Doctor };
const DEMO_PATIENT: User = { id: 'patient_01', name: 'Rohan Sharma', role: Role.Patient };

const HowItWorks: React.FC<HowItWorksProps> = ({ language }) => {
    const [translatedText, setTranslatedText] = useState({
        title: "System Architecture & Principles",
        subtitle: "How HealthChain is designed for security, privacy, and interoperability.",
        demoTitle: "Interactive Architecture Demo",
        demoSubtitle: "Click a block on the ledger to see the principles in action.",
        onChainTitle: "On-Chain Ledger (The Proof)",
        offChainTitle: "Secure Off-Chain Vault (The Data)",
        smartContractTitle: "Smart Contract Console (The Rules)",
        grantAccess: "Grant Access (24h)",
        revokeAccess: "Revoke Access",
        accessStatus: "Access Status for Dr. Rao:",
        granted: "GRANTED",
        denied: "DENIED",
        selectBlock: "Select a block to query the vault.",
        fetching: "Querying vault...",
        viewRecord: "View Record",
        noAccess: "Access Denied by Smart Contract.",
    });

    const [chain, setChain] = useState<Block<HealthRecordRef>[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<Block<HealthRecordRef> | null>(null);
    const [offChainData, setOffChainData] = useState<HealthRecord | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const chainData = blockchain.getHealthChain(DEMO_PATIENT_ID, DEMO_PATIENT) || [];
        setChain(chainData.slice(-4)); // Get last 4 blocks for demo
        checkAccess();
    }, []);

    const checkAccess = () => {
        const grant = blockchain.getAccessStatus(DEMO_PATIENT_ID, DEMO_DOCTOR.id);
        setHasAccess(!!grant);
    };

    const handleSelectBlock = (block: Block<HealthRecordRef>) => {
        setSelectedBlock(block);
        setIsFetching(true);
        setOffChainData(null);
        
        // Simulate network delay and permission check
        setTimeout(() => {
            if (hasAccess) {
                const record = blockchain.getHealthRecord(block.data.recordHash, DEMO_PATIENT_ID, DEMO_DOCTOR);
                setOffChainData(record);
            }
            setIsFetching(false);
        }, 1000);
    };

    const handleGrantAccess = () => {
        blockchain.grantAccess(DEMO_PATIENT_ID, DEMO_DOCTOR.id, 24);
        checkAccess();
        // If a block was selected, re-fetch data with new permissions
        if (selectedBlock) {
            handleSelectBlock(selectedBlock);
        }
    };
    
    const handleRevokeAccess = () => {
        blockchain.revokeAccess(DEMO_PATIENT_ID, DEMO_DOCTOR.id);
        checkAccess();
        // If a block was selected, re-fetch data with new permissions
        if (selectedBlock) {
            handleSelectBlock(selectedBlock);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-100 glow-text">{translatedText.title}</h1>
                <p className="text-lg text-slate-400 mt-2">{translatedText.subtitle}</p>
            </div>
            
            <div className="text-center">
                 <h2 className="text-3xl font-bold text-slate-200">{translatedText.demoTitle}</h2>
                 <p className="text-slate-400">{translatedText.demoSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* On-Chain Ledger */}
                <Card>
                    <h3 className="text-xl font-bold text-pink-400 mb-4">{translatedText.onChainTitle}</h3>
                    <div className="space-y-3">
                        {chain.slice(1).reverse().map(block => (
                            <div key={block.hash} onClick={() => handleSelectBlock(block)} className={`p-3 rounded-lg cursor-pointer transition border-2 ${selectedBlock?.hash === block.hash ? 'bg-slate-700 border-pink-500' : 'bg-slate-800 border-slate-700 hover:border-pink-400'}`}>
                                <div className="flex items-center space-x-3">
                                    <CubeTransparentIcon className="w-8 h-8 text-pink-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-200">Record from {new Date(block.timestamp).toLocaleDateString()}</p>
                                        <p className="text-xs text-slate-400 font-mono truncate">Data Hash: {block.data.recordHash}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Off-Chain and Smart Contract */}
                <div className="space-y-8">
                    <Card>
                        <h3 className="text-xl font-bold text-pink-400 mb-4">{translatedText.smartContractTitle}</h3>
                        <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-slate-300">{translatedText.accessStatus}</p>
                                <p className={`font-bold text-lg ${hasAccess ? 'text-green-400' : 'text-red-400'}`}>
                                    {hasAccess ? translatedText.granted : translatedText.denied}
                                </p>
                            </div>
                            {hasAccess ? (
                                <button onClick={handleRevokeAccess} className="bg-red-600 text-white font-bold text-sm py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center"><LockClosedIcon className="w-4 h-4 mr-2"/>{translatedText.revokeAccess}</button>
                            ) : (
                                <button onClick={handleGrantAccess} className="bg-green-600 text-white font-bold text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center"><KeyIcon className="w-4 h-4 mr-2"/>{translatedText.grantAccess}</button>
                            )}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold text-pink-400 mb-4">{translatedText.offChainTitle}</h3>
                        <div className="min-h-[200px] flex items-center justify-center bg-slate-800/50 rounded-lg p-4">
                            {!selectedBlock ? <p className="text-slate-400">{translatedText.selectBlock}</p> :
                             isFetching ? <p className="text-slate-300 animate-pulse">{translatedText.fetching}</p> :
                             offChainData ? (
                                <div className="text-left w-full pop-in">
                                    <div className="flex items-center text-green-400 mb-2">
                                        <LockOpenIcon className="w-6 h-6 mr-2"/>
                                        <h4 className="font-bold">Access Granted - Record Decrypted</h4>
                                    </div>
                                    <pre className="bg-slate-900 text-xs text-slate-200 p-3 rounded-md overflow-x-auto">
                                        {JSON.stringify(offChainData, null, 2)}
                                    </pre>
                                </div>
                             ) : (
                                <div className="text-center text-red-400 pop-in">
                                     <LockClosedIcon className="w-12 h-12 mx-auto mb-2"/>
                                     <p className="font-bold">{translatedText.noAccess}</p>
                                </div>
                             )
                            }
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;