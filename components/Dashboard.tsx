import React, { useEffect, useState } from 'react';
import { Page, User, Role, Language } from '../types';
import { translateText } from '../services/geminiService';
import Card from './common/Card';
import {
    ClipboardListIcon,
    CpuChipIcon,
    DatabaseIcon,
    KeyIcon,
    LightBulbIcon,
    SparklesIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    CubeTransparentIcon
} from './icons';

interface DashboardProps {
    user: User;
    setPage: (page: Page) => void;
    language: Language;
}

interface Feature {
    id: Page;
    titleKey: string;
    descriptionKey: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    roles: Role[];
}

const features: Feature[] = [
    { id: Page.HealthRecord, titleKey: "Health Records", descriptionKey: "View your secure, on-chain health history.", icon: ClipboardListIcon, color: "pink", roles: [Role.Patient, Role.Doctor] },
    { id: Page.PatientAnalysis, titleKey: "Health Analysis", descriptionKey: "Visualize your health data and trends.", icon: SparklesIcon, color: "blue", roles: [Role.Patient, Role.Doctor] },
    { id: Page.AiChatbot, titleKey: "AI Assistant", descriptionKey: "Ask health questions to a trained AI model.", icon: CpuChipIcon, color: "purple", roles: [Role.Patient, Role.Doctor] },
    { id: Page.FindDoctor, titleKey: "Find a Doctor", descriptionKey: "Search for specialists and book appointments.", icon: UserCircleIcon, color: "green", roles: [Role.Patient] },
    { id: Page.HealthSchemes, titleKey: "Health Schemes", descriptionKey: "Discover relevant government health schemes.", icon: ShieldCheckIcon, color: "yellow", roles: [Role.Patient] },
    { id: Page.FemaleHealth, titleKey: "Female Health", descriptionKey: "Track your cycle and get personalized insights.", icon: LightBulbIcon, color: "rose", roles: [Role.Patient] },
    { id: Page.AuditTrail, titleKey: "Audit Trail", descriptionKey: "Monitor all access and actions on the network.", icon: KeyIcon, color: "indigo", roles: [Role.Auditor] },
    { id: Page.ResearchData, titleKey: "Research Data", descriptionKey: "Access anonymized data for research.", icon: DatabaseIcon, color: "teal", roles: [Role.Researcher] },
    { id: Page.HowItWorks, titleKey: "How It Works", descriptionKey: "Learn about the system architecture.", icon: CubeTransparentIcon, color: "cyan", roles: [Role.Patient, Role.Doctor, Role.Auditor, Role.Researcher] }
];

const getIconColorClass = (color: string) => {
    const map: Record<string, string> = {
        pink: "text-pink-400",
        blue: "text-blue-400",
        purple: "text-purple-400",
        green: "text-green-400",
        yellow: "text-yellow-400",
        rose: "text-rose-400",
        indigo: "text-indigo-400",
        teal: "text-teal-400",
        cyan: "text-cyan-400",
    };
    return map[color] || 'text-slate-400';
}

const Dashboard: React.FC<DashboardProps> = ({ user, setPage, language }) => {
    const [translatedText, setTranslatedText] = useState({
        welcome: "Welcome",
        dashboard: "Dashboard",
    });
    const [translatedFeatures, setTranslatedFeatures] = useState<Record<string, {title: string, description: string}>>({});

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                welcome: await translateText("Welcome", language),
                dashboard: await translateText("Dashboard", language),
            });
            const translations: Record<string, {title: string, description: string}> = {};
            for (const feature of features) {
                translations[feature.id] = {
                    title: await translateText(feature.titleKey, language),
                    description: await translateText(feature.descriptionKey, language)
                }
            }
            setTranslatedFeatures(translations);
        };
        translate();
    }, [language]);

    const availableFeatures = features.filter(f => f.roles.includes(user.role));

    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-slate-100 glow-text">{`${translatedText.welcome}, ${user.name}!`}</h1>
                <p className="text-lg text-slate-400 mt-2">{translatedText.dashboard}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableFeatures.map(feature => (
                    <Card key={feature.id} onClick={() => setPage(feature.id)} className="flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
                        <feature.icon className={`w-12 h-12 mb-4 ${getIconColorClass(feature.color)}`} />
                        <h2 className="text-xl font-bold text-slate-100 mb-2">{translatedFeatures[feature.id]?.title || feature.titleKey}</h2>
                        <p className="text-slate-400 text-sm flex-grow">{translatedFeatures[feature.id]?.description || feature.descriptionKey}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;