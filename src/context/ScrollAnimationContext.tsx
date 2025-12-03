import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface ScrollAnimationContextType {
    dotPosition: { x: number; y: number };
    setDotPosition: (pos: { x: number; y: number }) => void;
    animationStage: 'problem' | 'transition' | 'solution' | 'complete';
    setAnimationStage: (stage: 'problem' | 'transition' | 'solution' | 'complete') => void;
    problemSectionRef: React.RefObject<HTMLElement>;
    solutionSectionRef: React.RefObject<HTMLElement>;
    mockupRef: React.RefObject<HTMLDivElement>;
    dotRef: React.RefObject<HTMLDivElement>;
}

const ScrollAnimationContext = createContext<ScrollAnimationContextType | undefined>(undefined);

export const ScrollAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
    const [animationStage, setAnimationStage] = useState<'problem' | 'transition' | 'solution' | 'complete'>('problem');

    const problemSectionRef = useRef<HTMLElement>(null);
    const solutionSectionRef = useRef<HTMLElement>(null);
    const mockupRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    return (
        <ScrollAnimationContext.Provider value={{
            dotPosition,
            setDotPosition,
            animationStage,
            setAnimationStage,
            problemSectionRef,
            solutionSectionRef,
            mockupRef,
            dotRef
        }}>
            {children}
        </ScrollAnimationContext.Provider>
    );
};

export const useScrollAnimation = () => {
    const context = useContext(ScrollAnimationContext);
    if (context === undefined) {
        throw new Error('useScrollAnimation must be used within a ScrollAnimationProvider');
    }
    return context;
};
