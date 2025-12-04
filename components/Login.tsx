import React, { useState, useEffect } from 'react';
import { User, Language } from '../types';
import { authenticateUser } from '../services/blockchainService';
import { translateText } from '../services/geminiService';
import { ShieldCheckIcon, UserCircleIcon, KeyIcon, FingerPrintIcon } from './icons';

interface LoginProps {
  onLogin: (user: User) => void;
  language: Language;
}

const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const [aadhar, setAadhar] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState({
    title: 'HealthChain Secure',
    subtitle: 'Decentralized Health Records',
    aadharLabel: 'Aadhar Number',
    secretCodeLabel: 'Access Code',
    loginButton: 'Secure Login',
    denied: 'Permission Denied. Please check your credentials.',
    loggingIn: 'Authenticating...'
  });

  useEffect(() => {
    const translate = async () => {
        const title = await translateText('HealthChain Secure', language);
        const subtitle = await translateText('Decentralized Health Records', language);
        const aadharLabel = await translateText('Aadhar Number', language);
        const secretCodeLabel = await translateText('Access Code', language);
        const loginButton = await translateText('Secure Login', language);
        const denied = await translateText('Permission Denied. Please check your credentials.', language);
        const loggingIn = await translateText('Authenticating...', language);
        setTranslatedText({ title, subtitle, aadharLabel, secretCodeLabel, loginButton, denied, loggingIn });
    };
    translate();
  }, [language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => { // Simulate network delay
      const user = authenticateUser(aadhar, secretCode);
      if (user) {
        onLogin(user);
      } else {
        setError(translatedText.denied);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <ShieldCheckIcon className="w-16 h-16 mx-auto text-pink-500" />
          <h1 className="text-4xl font-bold text-slate-100 mt-4 glow-text">{translatedText.title}</h1>
          <p className="text-lg text-slate-400">{translatedText.subtitle}</p>
        </div>
        
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <label htmlFor="aadhar" className="block text-slate-300 text-sm font-bold mb-2">{translatedText.aadharLabel}</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-8">
                <UserCircleIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="aadhar"
                type="text"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                placeholder="Enter 12-digit number"
                className="shadow-inner appearance-none border border-slate-600 rounded-lg w-full py-3 pl-10 pr-3 text-slate-200 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-700/50"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label htmlFor="secretCode" className="block text-slate-300 text-sm font-bold mb-2">{translatedText.secretCodeLabel}</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-8">
                <KeyIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="secretCode"
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="************"
                className="shadow-inner appearance-none border border-slate-600 rounded-lg w-full py-3 pl-10 pr-3 text-slate-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-700/50"
                required
              />
            </div>
            {error && <p className="text-red-400 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
              >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {translatedText.loggingIn}
                    </>
                ) : (
                    <>
                        <FingerPrintIcon className="w-5 h-5 mr-2" />
                        {translatedText.loginButton}
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;