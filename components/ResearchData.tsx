import React, { useState, useEffect, useMemo } from 'react';
import { User, Language, Role } from '../types';
import * as blockchain from '../services/blockchainService';
import Card from './common/Card';
import { translateText } from '../services/geminiService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatabaseIcon } from './icons';

interface ResearchDataProps {
    user: User;
    language: Language;
}

const COLORS = ['#FF69B4', '#1E90FF', '#32CD32', '#FFD700', '#FF4500', '#9370DB'];

const ResearchData: React.FC<ResearchDataProps> = ({ user, language }) => {
    const [data, setData] = useState<any[] | null>(null);
    const [translatedText, setTranslatedText] = useState({
        title: "Anonymized Research Data",
        subtitle: "Aggregated health data for research purposes. All personally identifiable information has been removed.",
        noAccess: "You do not have permission to view research data.",
        noData: "No data available for research.",
        diseaseDistributionTitle: "Overall Disease Distribution",
    });

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                title: await translateText("Anonymized Research Data", language),
                subtitle: await translateText("Aggregated health data for research purposes. All personally identifiable information has been removed.", language),
                noAccess: await translateText("You do not have permission to view research data.", language),
                noData: await translateText("No data available for research.", language),
                diseaseDistributionTitle: await translateText("Overall Disease Distribution", language),
            });
        };
        translate();
    }, [language]);

    useEffect(() => {
        if (user.role === Role.Researcher) {
            const researchData = blockchain.getAnonymizedData(user);
            setData(researchData);
        }
    }, [user]);

    if (user.role !== Role.Researcher) {
        return (
            <Card>
                <p className="text-red-400">{translatedText.noAccess}</p>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-slate-700/80 p-2 border border-slate-600 rounded">
              <p className="label text-slate-200">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
          );
        }
        return null;
    };

    return (
        <div>
            <div className="text-center mb-8">
                <DatabaseIcon className="w-12 h-12 mx-auto text-teal-400" />
                <h1 className="text-3xl font-bold text-slate-100 mt-4">{translatedText.title}</h1>
                <p className="text-slate-400">{translatedText.subtitle}</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold mb-4 text-pink-400">{translatedText.diseaseDistributionTitle}</h2>
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                // FIX: The 'percent' property can be undefined. Added a fallback to 0 to prevent an arithmetic error when calculating the label.
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-slate-400">{translatedText.noData}</p>
                )}
            </Card>
        </div>
    );
};

export default ResearchData;