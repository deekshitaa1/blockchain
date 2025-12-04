import React, { useState, useEffect } from 'react';
import { User, Language, AuditLog, Role } from '../types';
import * as blockchain from '../services/blockchainService';
import Card from './common/Card';
import { translateText } from '../services/geminiService';
import { KeyIcon } from './icons';

interface AuditTrailProps {
    user: User;
    language: Language;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ user, language }) => {
    const [logs, setLogs] = useState<AuditLog[] | null>(null);
    const [translatedText, setTranslatedText] = useState({
        title: "System Audit Trail",
        subtitle: "A chronological record of all significant actions within the HealthChain network.",
        noAccess: "You do not have permission to view the audit trail.",
        noLogs: "No audit logs found.",
        colTimestamp: "Timestamp",
        colAccessor: "Accessor",
        colPatient: "Patient ID",
        colAction: "Action",
        colDetails: "Details",
    });

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                title: await translateText("System Audit Trail", language),
                subtitle: await translateText("A chronological record of all significant actions within the HealthChain network.", language),
                noAccess: await translateText("You do not have permission to view the audit trail.", language),
                noLogs: await translateText("No audit logs found.", language),
                colTimestamp: await translateText("Timestamp", language),
                colAccessor: await translateText("Accessor", language),
                colPatient: await translateText("Patient ID", language),
                colAction: await translateText("Action", language),
                colDetails: await translateText("Details", language),
            });
        };
        translate();
    }, [language]);

    useEffect(() => {
        if (user.role === Role.Auditor) {
            const auditLogs = blockchain.getAuditTrail(user);
            setLogs(auditLogs);
        }
    }, [user]);

    if (user.role !== Role.Auditor) {
        return (
            <Card>
                <p className="text-red-400">{translatedText.noAccess}</p>
            </Card>
        );
    }

    const getActionColor = (action: AuditLog['action']) => {
        switch (action) {
            case 'LOGIN_SUCCESS': return 'text-green-400';
            case 'LOGIN_FAIL': return 'text-yellow-400';
            case 'VIEW_RECORD': return 'text-blue-400';
            case 'GRANT_ACCESS': return 'text-pink-400';
            case 'REVOKE_ACCESS': return 'text-orange-400';
            default: return 'text-slate-400';
        }
    }

    return (
        <Card>
            <div className="text-center mb-8">
                <KeyIcon className="w-12 h-12 mx-auto text-indigo-400" />
                <h1 className="text-3xl font-bold text-slate-100 mt-4">{translatedText.title}</h1>
                <p className="text-slate-400">{translatedText.subtitle}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-slate-800/50 rounded-lg">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left p-3 text-sm font-semibold text-slate-300">{translatedText.colTimestamp}</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-300">{translatedText.colAccessor}</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-300">{translatedText.colPatient}</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-300">{translatedText.colAction}</th>
                            <th className="text-left p-3 text-sm font-semibold text-slate-300">{translatedText.colDetails}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs && logs.length > 0 ? logs.map(log => (
                            <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                <td className="p-3 text-sm text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-3 text-sm text-slate-200">{log.accessorName} ({log.accessorRole})</td>
                                <td className="p-3 text-sm text-slate-400 font-mono">{log.patientId}</td>
                                <td className={`p-3 text-sm font-semibold ${getActionColor(log.action)}`}>{log.action.replace('_', ' ')}</td>
                                <td className="p-3 text-sm text-slate-300">{log.details}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-slate-400">{translatedText.noLogs}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default AuditTrail;
