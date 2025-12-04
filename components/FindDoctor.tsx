import React, { useState, useEffect } from 'react';
import { Type } from '@google/genai';
import Card from './common/Card';
import { generateStructuredText, translateText } from '../services/geminiService';
import { Language, DoctorInfo } from '../types';

const FindDoctor: React.FC<{ language: Language }> = ({ language }) => {
    const [location, setLocation] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [doctors, setDoctors] = useState<DoctorInfo[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

     const [translatedText, setTranslatedText] = useState({
        title: "Find a Doctor Near You",
        subtitle: "Get suggestions for doctors and book an emergency slot.",
        locationLabel: "Your Location (e.g., Jayanagar, Bangalore)",
        specialtyLabel: "Specialty (e.g., Cardiologist, Dentist)",
        searchButton: "Search Doctors",
        resultsTitle: "Doctor Suggestions",
        bookEmergencyButton: "Book Emergency",
        bookingConfirmation: "Emergency slot booked! The doctor has been notified.",
        loadingText: "Finding doctors...",
        error: "An error occurred. Please try again.",
    });

    useEffect(() => {
        const translate = async () => {
            setTranslatedText({
                title: await translateText("Find a Doctor Near You", language),
                subtitle: await translateText("Get suggestions for doctors and book an emergency slot.", language),
                locationLabel: await translateText("Your Location (e.g., Jayanagar, Bangalore)", language),
                specialtyLabel: await translateText("Specialty (e.g., Cardiologist, Dentist)", language),
                searchButton: await translateText("Search Doctors", language),
                resultsTitle: await translateText("Doctor Suggestions", language),
                bookEmergencyButton: await translateText("Book Emergency", language),
                bookingConfirmation: await translateText("Emergency slot booked! The doctor has been notified.", language),
                loadingText: await translateText("Finding doctors...", language),
                error: await translateText("An error occurred. Please try again.", language),
            });
        };
        translate();
    }, [language]);
    
    const doctorSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                specialty: { type: Type.STRING },
                clinic: { type: Type.STRING },
                address: { type: Type.STRING },
                phone: { type: Type.STRING },
            },
            required: ["name", "specialty", "clinic", "address", "phone"],
        },
    };

    const handleSearch = async () => {
        if (!location || !specialty) return;
        setLoading(true);
        setError('');
        setDoctors(null);
        const prompt = `List 3 ${specialty} doctors near ${location}. Include their name, specialty, clinic name, address, and phone number. Respond in ${language}.`;
        const result = await generateStructuredText(prompt, doctorSchema);
        
        if (result.error) {
            setError(translatedText.error);
        } else {
            setDoctors(result);
        }
        setLoading(false);
    };

    const handleEmergencyBooking = (doctorName: string) => {
        alert(`${translatedText.bookingConfirmation} with ${doctorName}.`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-100">{translatedText.title}</h1>
                    <p className="text-slate-400 mt-2">{translatedText.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input type="text" placeholder={translatedText.locationLabel} value={location} onChange={e => setLocation(e.target.value)} className="shadow-inner border border-slate-600 bg-slate-700/50 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    <input type="text" placeholder={translatedText.specialtyLabel} value={specialty} onChange={e => setSpecialty(e.target.value)} className="shadow-inner border border-slate-600 bg-slate-700/50 text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
                <button onClick={handleSearch} disabled={loading || !location || !specialty} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5">
                    {loading ? translatedText.loadingText : translatedText.searchButton}
                </button>
            </Card>
            
            {loading && <Card className="mt-8 text-center"><p>{translatedText.loadingText}</p></Card>}
            {error && <Card className="mt-8 text-center text-red-400"><p>{error}</p></Card>}

            {doctors && !loading && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">{translatedText.resultsTitle}</h2>
                    <div className="space-y-6">
                        {doctors.map((doctor, index) => (
                            <Card key={index}>
                                <h3 className="text-xl font-bold text-pink-400">{doctor.name}</h3>
                                <p className="text-slate-300 font-semibold">{doctor.specialty}</p>
                                <p className="text-slate-400 mt-2">{doctor.clinic}</p>
                                <p className="text-slate-400">{doctor.address}</p>
                                <p className="text-slate-300 mt-2 font-mono">{doctor.phone}</p>
                                <button onClick={() => handleEmergencyBooking(doctor.name)} className="mt-4 w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-500/40 transform hover:-translate-y-0.5">
                                    {translatedText.bookEmergencyButton}
                                </button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindDoctor;
