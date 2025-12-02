import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { listThemes } from '@/themes';
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ArrowLeft } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

const ThemesShowcasePage = () => {
    const { settings, updateSettings } = useSettings();
    const themes = listThemes();
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeChange = (themeId: string) => {
        updateSettings(['appearance', 'colorScheme'], themeId);
    };

    const currentTheme = themes.find(t => t.metadata.id === settings.appearance.colorScheme) || themes[0];

    if (!mounted) return null;

    return (
        <div className="h-screen w-screen bg-transparent relative overflow-hidden">
            {/* Minimal Floating Controls */}
            <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-[200px] justify-between bg-background/20 backdrop-blur-md border-white/10 text-foreground hover:bg-background/40 transition-all"
                        >
                            {currentTheme?.metadata.name || "Select Theme"}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] max-h-[500px] overflow-y-auto bg-background/80 backdrop-blur-xl border-white/10">
                        {themes.map((theme) => (
                            <DropdownMenuItem
                                key={theme.metadata.id}
                                onClick={() => handleThemeChange(theme.metadata.id)}
                                className="flex items-center justify-between cursor-pointer focus:bg-white/10"
                            >
                                <span>{theme.metadata.name}</span>
                                {settings.appearance.colorScheme === theme.metadata.id && (
                                    <Check className="h-4 w-4" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="text-foreground/60 hover:text-foreground hover:bg-background/20 backdrop-blur-sm transition-all"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to App
                </Button>
            </div>

            {/* Theme Info (Subtle, Bottom Left) */}
            <div className="absolute bottom-6 left-6 z-40 max-w-md pointer-events-none select-none">
                <h1 className="text-4xl font-bold text-foreground/90 drop-shadow-lg mb-2">
                    {currentTheme?.metadata.name}
                </h1>
                <p className="text-lg text-foreground/70 drop-shadow-md">
                    {currentTheme?.metadata.description}
                </p>
            </div>
        </div>
    );
};

export default ThemesShowcasePage;
