import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Ad_chatbot = () => {
    const [area, setArea] = useState('');
    const [season, setSeason] = useState('');
    const [temperature, setTemperature] = useState('');
    const [soilType, setSoilType] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [advice, setAdvice] = useState('');
    const [showAdvice, setShowAdvice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const API_TOKEN = import.meta.env.VITE_OPENROUTER_API_KEY;

    const getCropAdvice = async () => {
        if (!API_TOKEN) {
            toast({
                title: "Configuration Error",
                description: "API key is not configured. Please check your environment variables.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        const payload = {
            model: "deepseek/deepseek-r1:free",
            messages: [
                {
                    role: "system",
                    content: "You are an expert agricultural assistant specialized in Karnataka farming conditions. Provide accurate crop and equipment advice in a clear, friendly tone.",
                },
                {
                    role: "user",
                    content: `Here are the farming conditions:\nArea: ${area}\nSeason: ${season}\nTemperature: ${temperature}\nSoil Type: ${soilType}\nRainfall: ${rainfall}\n\nSuggest suitable crops and equipment needed.`,
                }
            ]
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "X-Title": "FarmWise Crop Chatbot",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            if (data && data.choices && data.choices.length > 0) {
                setAdvice(data.choices[0].message.content.trim());
            } else {
                throw new Error("Invalid response format from API");
            }
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred while getting crop advice.",
                variant: "destructive",
            });
            setAdvice("Sorry, I couldn't get the advice at this time. Please try again later.");
        } finally {
            setIsLoading(false);
            setShowAdvice(true);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Get Crop Advice</CardTitle>
                    <CardDescription>Enter your agricultural conditions below:</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="area">Area (acres/hectares)</Label>
                        <Input 
                            type="text" 
                            id="area" 
                            value={area} 
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="Enter your farm area"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="season">Season</Label>
                        <Input 
                            type="text" 
                            id="season" 
                            value={season} 
                            onChange={(e) => setSeason(e.target.value)}
                            placeholder="Enter current season"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="temperature">Temperature (°C/°F)</Label>
                        <Input 
                            type="text" 
                            id="temperature" 
                            value={temperature} 
                            onChange={(e) => setTemperature(e.target.value)}
                            placeholder="Enter temperature"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="soilType">Soil Type</Label>
                        <Input 
                            type="text" 
                            id="soilType" 
                            value={soilType} 
                            onChange={(e) => setSoilType(e.target.value)}
                            placeholder="Enter soil type"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rainfall">Rainfall (mm/inches)</Label>
                        <Input 
                            type="text" 
                            id="rainfall" 
                            value={rainfall} 
                            onChange={(e) => setRainfall(e.target.value)}
                            placeholder="Enter rainfall"
                        />
                    </div>
                    <Button 
                        onClick={getCropAdvice}
                        disabled={isLoading}
                    >
                        {isLoading ? "Getting Advice..." : "Get Crop Advice"}
                    </Button>
                    {showAdvice && (
                        <div className="mt-4">
                            <Card>
                                <CardContent>
                                    <pre className="whitespace-pre-wrap">{advice}</pre>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Ad_chatbot;
