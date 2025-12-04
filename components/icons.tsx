import React from 'react';

const IconProps = {
  className: 'w-6 h-6',
};

type IconComponentProps = {
    className?: string;
}

export const ShieldCheckIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 3 9-3a12.02 12.02 0 00-2.382-9.971z" />
  </svg>
);

export const UserCircleIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const KeyIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

export const FingerPrintIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.789-2.756 9.588-1.748 2.8-4.402 4.412-7.244 4.412m14-8.172a5.5 5.5 0 01-11 0m11 0a5.5 5.5 0 00-11 0m11 0a5.5 5.5 0 01-11 0m0 0a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm-7.244 8.172a3.5 3.5 0 00-4.756-4.756m4.756 4.756L4 20" />
  </svg>
);

export const ClockIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LockClosedIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const LockOpenIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

export const ClipboardListIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export const LinkIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export const LightBulbIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export const SparklesIcon: React.FC<IconComponentProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || IconProps.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293M17.707 5.293L15.414 7.586m3.293 3.293l-2.293 2.293m2.293-2.293l2.293 2.293M9 21v-4m2 2H7m5 3l-2.293-2.293M15.414 16.414L17.707 18.707m-3.293-3.293l2.293-2.293m-2.293 2.293L9 11" />
  </svg>
);

export const CpuChipIcon: React.FC<IconComponentProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || IconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v-1.5m0 18v-1.5M15.75 21v-1.5m-6-1.5H12m6 0h-1.5M12 8.25h1.5M12 15.75h1.5M6 8.25h1.5m-1.5 7.5h1.5m7.5-7.5h1.5m-1.5 7.5h1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h9v9h-9z" />
    </svg>
);

export const CubeTransparentIcon: React.FC<IconComponentProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || IconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25M12 12.75l9 5.25" />
    </svg>
);

export const DatabaseIcon: React.FC<IconComponentProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || IconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const ArrowRightIcon: React.FC<IconComponentProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || IconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);
