import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// FIX: Use correct types 'Block' and 'HealthRecordRef' instead of non-existent 'HealthBlock'.
import { User, Role, Language, Block, HealthRecordRef } from '../types';
// FIX: Import 'getHealthRecord' to fetch detailed off-chain data for analysis.
import { getHealthChain, getHealthRecord } from '../services/blockchainService';
import Card from './common/Card';
import { translateText } from '../services/geminiService';

interface PatientAnalysisProps {
  user: User;
  language: Language;
}

const COLORS = ['#FF69B4', '#C71585', '#DB7093', '#FF1493', '#FFB6C1', '#FFC0CB'];

const PatientAnalysis: React.FC<PatientAnalysisProps> = ({ user, language }) => {
    // FIX: Use the correct mock patient ID for non-patient roles for demonstration purposes.
    const patientIdForView = user.role === Role.Patient ? user.id : 'patient_01';
    // FIX: Use the correct state type 'Block<HealthRecordRef>[]'
    const [chain, setChain] = useState<Block<HealthRecordRef>[] | null>(null);

    const [translatedText, setTranslatedText] = useState({
        title: "Patient Health Dashboard",
        consultationsTitle: "Consultations Over Time",
        diseaseDistributionTitle: "Disease Distribution",
        consultations: "Consultations",
        month: "Month",
        noData: "Not enough data for analysis.",
    });

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                title: await translateText("Patient Health Dashboard", language),
                consultationsTitle: await translateText("Consultations Over Time", language),
                diseaseDistributionTitle: await translateText("Disease Distribution", language),
                consultations: await translateText("Consultations", language),
                month: await translateText("Month", language),
                noData: await translateText("Not enough data for analysis.", language),
            });
        };
        translate();
    }, [language]);


    useEffect(() => {
        // FIX: Pass the full 'user' object as the requester, not just 'user.role'.
        const records = getHealthChain(patientIdForView, user);
        setChain(records);
    }, [user, patientIdForView]);

    const chartData = useMemo(() => {
        if (!chain || chain.length <= 1) return { monthlyData: [], diseaseData: [] };

        // FIX: Fetch full record details to access disease info for the pie chart.
        const recordsWithDetails = chain.slice(1).map(block => {
            const recordDetails = getHealthRecord(block.data.recordHash, patientIdForView, user);
            const diagnosisEntry = recordDetails?.entry.find(e => e.resourceType === 'Observation');
            const disease = (diagnosisEntry && 'code' in diagnosisEntry) ? (diagnosisEntry.code as {text: string}).text : 'Unknown';
            
            return {
                timestamp: block.data.timestamp,
                disease,
            };
        });


        const monthlyCounts = recordsWithDetails.reduce((acc, record) => {
            // FIX: Use 'timestamp' which exists on the record data, instead of 'date'.
            const month = new Date(record.timestamp).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const monthlyData = Object.entries(monthlyCounts).map(([name, value]) => ({ name, consultations: value }));
        
        const diseaseCounts = recordsWithDetails.reduce((acc, record) => {
            acc[record.disease] = (acc[record.disease] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const diseaseData = Object.entries(diseaseCounts).map(([name, value]) => ({ name, value }));

        return { monthlyData, diseaseData };
    }, [chain, patientIdForView, user]);


    if (!chain || chain.length <= 1) {
        return (
            <Card>
                <h1 className="text-3xl font-bold text-slate-100 mb-2">{translatedText.title}</h1>
                <p>{translatedText.noData}</p>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-slate-700/80 p-2 border border-slate-600 rounded">
              <p className="label text-slate-200">{`${label} : ${payload[0].value}`}</p>
            </div>
          );
        }
        return null;
    };

    // FIX: Define a custom label renderer to fix typing issues and apply styles.
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // This also fixes the arithmetic operation error by safely handling 'percent'.
        const percentage = ((percent || 0) * 100).toFixed(0);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                fontSize="12px"
                textAnchor="middle"
                dominantBaseline="central"
            >
                {`${name} ${percentage}%`}
            </text>
        );
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-slate-100 mb-8 text-center">{translatedText.title}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-pink-400">{translatedText.consultationsTitle}</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(219, 112, 147, 0.1)'}} />
                            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                            <Bar dataKey="consultations" fill="#FF69B4" name={translatedText.consultations} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-pink-400">{translatedText.diseaseDistributionTitle}</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.diseaseData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                // FIX: Use custom label which fixes type error and removes invalid `labelStyle` prop.
                                label={renderCustomizedLabel}
                            >
                                {chartData.diseaseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default PatientAnalysis;