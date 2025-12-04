import React, { useState, useEffect } from 'react';
import { Type } from '@google/genai';
import Card from './common/Card';
import { generateStructuredText, translateText } from '../services/geminiService';
import { Language, FemaleHealthAnalysis } from '../types';
import { LightBulbIcon, SparklesIcon } from './icons';

const FemaleHealth: React.FC<{ language: Language }> = ({ language }) => {
    const [lastPeriodDate, setLastPeriodDate] = useState('');
    const [cycleLength, setCycleLength] = useState('28');
    const [analysis, setAnalysis] = useState<FemaleHealthAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [translatedText, setTranslatedText] = useState({
        title: "Female Health Tracker",
        subtitle: "Track your menstrual cycle and get personalized health insights.",
        lastPeriodLabel: "Last Period Start Date",
        cycleLengthLabel: "Average Cycle Length (days)",
        getInsightsButton: "Get Insights",
        loadingText: "Analyzing your cycle...",
        resultsTitle: "Your Health Insights",
        nextPeriod: "Estimated Next Period",
        fertileWindow: "Estimated Fertile Window",
        currentPhase: "Current Cycle Phase",
        healthTips: "Personalized Health Tips",
        error: "An error occurred. Please try again.",
    });

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                title: await translateText("Female Health Tracker", language),
                subtitle: await translateText("Track your menstrual cycle and get personalized health insights.", language),
                lastPeriodLabel: await translateText("Last Period Start Date", language),
                cycleLengthLabel: await translateText("Average Cycle Length (days)", language),
                getInsightsButton: await translateText("Get Insights", language),
                loadingText: await translateText("Analyzing your cycle...", language),
                resultsTitle: await translateText("Your Health Insights", language),
                nextPeriod: await translateText("Estimated Next Period", language),
                fertileWindow: await translateText("Estimated Fertile Window", language),
                currentPhase: await translateText("Current Cycle Phase", language),
                healthTips: await translateText("Personalized Health Tips", language),
                error: await translateText("An error occurred. Please try again.", language),
            });
        };
        translate();
    }, [language]);

    const analysisSchema = {
        type: Type.OBJECT,
        properties: {
            nextPeriod: { type: Type.STRING },
            fertileWindow: { type: Type.STRING },
            currentPhase: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    insights: { type: Type.STRING },
                },
                required: ["name", "insights"]
            },
            healthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING },
        },
        required: ["nextPeriod", "fertileWindow", "currentPhase", "healthTips", "disclaimer"]
    };

    const handleGetInsights = async () => {
        if (!lastPeriodDate) {
            alert("Please enter your last period date.");
            return;
        }
        setLoading(true);
        setError('');
        setAnalysis(null);
        const prompt = `My last menstrual period started on ${lastPeriodDate} and my average cycle length is ${cycleLength} days. Provide a structured health analysis in JSON format. Include: estimated next period date, estimated fertile window, current phase of my cycle (with a name and insights), and some general health tips relevant to this phase. Format the response in a clear, friendly, and supportive tone. Respond in ${language}. Include a disclaimer that this is an estimation and not medical advice.`;
        
        const result = await generateStructuredText(prompt, analysisSchema);
        
        if (result.error) {
            setError(translatedText.error);
        } else {
            setAnalysis(result);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-100">{translatedText.title}</h1>
                    <p className="text-slate-400 mt-2">{translatedText.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">{translatedText.lastPeriodLabel}</label>
                        <input type="date" value={lastPeriodDate} onChange={e => setLastPeriodDate(e.target.value)} className="shadow-inner w-full border border-slate-600 bg-slate-700/50 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                     <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">{translatedText.cycleLengthLabel}</label>
                        <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} className="shadow-inner w-full border border-slate-600 bg-slate-700/50 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                </div>
                <button onClick={handleGetInsights} disabled={loading || !lastPeriodDate} className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 shadow-lg shadow-pink-500/30 transform hover:-translate-y-0.5">
                    {loading ? translatedText.loadingText : translatedText.getInsightsButton}
                </button>
            </Card>

            {loading && <Card className="mt-8 text-center"><p>{translatedText.loadingText}</p></Card>}
            {error && <Card className="mt-8 text-center text-red-400"><p>{error}</p></Card>}

            {analysis && !loading && (
                <Card className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-pink-400 text-center">{translatedText.resultsTitle}</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                            <div className="bg-slate-700/50 p-4 rounded-lg">
                                <h3 className="font-semibold text-slate-300">{translatedText.nextPeriod}</h3>
                                <p className="text-2xl font-bold text-pink-300">{analysis.nextPeriod}</p>
                            </div>
                             <div className="bg-slate-700/50 p-4 rounded-lg">
                                <h3 className="font-semibold text-slate-300">{translatedText.fertileWindow}</h3>
                                <p className="text-2xl font-bold text-pink-300">{analysis.fertileWindow}</p>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                             <h3 className="font-semibold text-slate-300 flex items-center mb-2">
                                <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-300"/>
                                {translatedText.currentPhase}: <span className="font-bold text-yellow-300 ml-2">{analysis.currentPhase.name}</span>
                             </h3>
                             <p className="text-slate-200">{analysis.currentPhase.insights}</p>
                        </div>
                         <div className="bg-slate-700/50 p-4 rounded-lg">
                             <h3 className="font-semibold text-slate-300 flex items-center mb-2">
                                <SparklesIcon className="w-5 h-5 mr-2 text-cyan-300"/>
                                {translatedText.healthTips}
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-200">
                                {analysis.healthTips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </div>
                        <p className="text-xs text-slate-500 text-center pt-4 border-t border-slate-700">{analysis.disclaimer}</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default FemaleHealth;
