import React, { useState, useEffect } from 'react';
import { Type } from '@google/genai';
import Card from './common/Card';
import { generateStructuredText, translateText } from '../services/geminiService';
import { Language, HealthScheme } from '../types';
import { ClipboardListIcon, LinkIcon } from './icons';

const HealthSchemes: React.FC<{ language: Language }> = ({ language }) => {
    const [schemes, setSchemes] = useState<HealthScheme[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userInput, setUserInput] = useState({ age: '30', state: 'Karnataka', income: '500000' });

    const [translatedText, setTranslatedText] = useState({
        title: "Government Health Schemes",
        subtitle: "Enter your details to discover personalized central and state government health schemes.",
        ageLabel: "Your Age",
        stateLabel: "Your State",
        incomeLabel: "Annual Income (INR)",
        searchButton: "Find My Schemes",
        loadingText: "Searching for relevant schemes...",
        resultsTitle: "Personalized Health Schemes For You",
        benefits: "Key Benefits",
        eligibility: "Eligibility",
        applyNow: "Apply Now",
        noSchemes: "No schemes found for the given criteria.",
        error: "An error occurred. Please try again.",
    });

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                title: await translateText("Government Health Schemes", language),
                subtitle: await translateText("Enter your details to discover personalized central and state government health schemes.", language),
                ageLabel: await translateText("Your Age", language),
                stateLabel: await translateText("Your State", language),
                incomeLabel: await translateText("Annual Income (INR)", language),
                searchButton: await translateText("Find My Schemes", language),
                loadingText: await translateText("Searching for relevant schemes...", language),
                resultsTitle: await translateText("Personalized Health Schemes For You", language),
                benefits: await translateText("Key Benefits", language),
                eligibility: await translateText("Eligibility", language),
                applyNow: await translateText("Apply Now", language),
                noSchemes: await translateText("No schemes found for the given criteria.", language),
                error: await translateText("An error occurred. Please try again.", language),
            });
        };
        translate();
    }, [language]);
    
    const schemeSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                eligibility: { type: Type.STRING },
                applicationLink: { type: Type.STRING },
            },
            required: ["name", "description", "benefits", "eligibility", "applicationLink"],
        },
    };

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setSchemes(null);
        const prompt = `Based on the following user profile, list the top 3-5 most relevant government health schemes from both central and state (${userInput.state}) levels in India. For each scheme, provide the name, a brief description, key benefits, eligibility criteria, and a direct, valid URL to the official application or information page. User Profile: Age ${userInput.age}, State: ${userInput.state}, Annual Income: INR ${userInput.income}. Respond in ${language}.`;
        
        const result = await generateStructuredText(prompt, schemeSchema);

        if (result.error) {
            setError(translatedText.error);
        } else {
            setSchemes(result);
        }
        setLoading(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <div className="text-center mb-6">
                     <h1 className="text-3xl font-bold text-slate-100">{translatedText.title}</h1>
                    <p className="text-slate-400 mt-2">{translatedText.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{translatedText.ageLabel}</label>
                        <input type="number" name="age" value={userInput.age} onChange={handleInputChange} className="shadow-inner w-full border border-slate-600 bg-slate-700/50 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{translatedText.stateLabel}</label>
                        <input type="text" name="state" value={userInput.state} onChange={handleInputChange} className="shadow-inner w-full border border-slate-600 bg-slate-700/50 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{translatedText.incomeLabel}</label>
                        <input type="number" name="income" value={userInput.income} onChange={handleInputChange} className="shadow-inner w-full border border-slate-600 bg-slate-700/50 text-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                </div>
                <button onClick={handleSearch} disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-500/30 transform hover:-translate-y-0.5">
                    {loading ? translatedText.loadingText : translatedText.searchButton}
                </button>
            </Card>

            {loading && <Card className="mt-8 text-center"><p>{translatedText.loadingText}</p></Card>}
            {error && <Card className="mt-8 text-center text-red-400"><p>{error}</p></Card>}

            {schemes && !loading && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-green-400 text-center">{translatedText.resultsTitle}</h2>
                    {schemes.length === 0 ? <p className="text-center">{translatedText.noSchemes}</p> : (
                        <div className="space-y-6">
                            {schemes.map((scheme, index) => (
                                <Card key={index}>
                                    <h3 className="text-xl font-bold text-pink-400">{scheme.name}</h3>
                                    <p className="text-slate-300 mt-1 mb-4">{scheme.description}</p>
                                    <h4 className="font-semibold text-slate-200 mb-2">{translatedText.benefits}</h4>
                                    <ul className="list-disc list-inside space-y-1 text-slate-300 mb-4">
                                        {scheme.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                                    </ul>
                                    <h4 className="font-semibold text-slate-200 mb-2">{translatedText.eligibility}</h4>
                                    <p className="text-slate-300 mb-6">{scheme.eligibility}</p>
                                    <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full sm:w-auto bg-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 transition shadow-lg shadow-pink-500/30 transform hover:-translate-y-0.5">
                                        <LinkIcon className="w-5 h-5 mr-2"/>
                                        {translatedText.applyNow}
                                    </a>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HealthSchemes;
