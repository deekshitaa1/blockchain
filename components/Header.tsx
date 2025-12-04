import React, { useState, useEffect } from 'react';
import { Page, User, Role, Language } from '../types';
import { ShieldCheckIcon, UserCircleIcon } from './icons';

interface HeaderProps {
    user: User;
    setPage: (page: Page) => void;
    onLogout: () => void;
    language: Language;
    setLanguage: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ user, setPage, onLogout, language, setLanguage }) => {

    const getRoleColor = (role: Role) => {
        switch (role) {
            case Role.Patient: return 'bg-pink-400/20 text-pink-300';
            case Role.Doctor: return 'bg-blue-400/20 text-blue-300';
            case Role.Auditor: return 'bg-purple-400/20 text-purple-300';
            case Role.Researcher: return 'bg-green-400/20 text-green-300';
            default: return 'bg-slate-400/20 text-slate-300';
        }
    }

    return (
        <header className="bg-slate-900/70 backdrop-blur-lg shadow-lg sticky top-0 z-50 p-4 border-b border-slate-700">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setPage(Page.Dashboard)}>
                    <ShieldCheckIcon className="w-10 h-10 text-pink-500" />
                    <h1 className="text-xl font-bold text-slate-200">HealthChain</h1>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <UserCircleIcon className="w-8 h-8 text-slate-400" />
                        <div>
                            <p className="font-semibold text-sm text-slate-200">{user.name}</p>
                            <p className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(user.role)}`}>{user.role}</p>
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="appearance-none bg-slate-800 border border-slate-600 rounded-md py-1 px-3 pr-8 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value={Language.English}>English</option>
                            <option value={Language.Hindi}>हिन्दी</option>
                            <option value={Language.Kannada}>ಕನ್ನಡ</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="bg-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors duration-300 shadow-md shadow-rose-600/30"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;