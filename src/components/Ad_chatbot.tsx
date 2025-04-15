import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Ad_chatbot = () => {
    const [area, setArea] = useState('');
    const [season, setSeason] = useState('');
    const [temperature, setTemperature] = useState('');
    const [soilType, setSoilType] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [advice, setAdvice] = useState('');
    const [showAdvice, setShowAdvice] = useState(false);

    const API_TOKEN = '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'; // Replace with your token
    const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'; // Correct API URL

    const getCropAdvice = async () => {
        const payload = {
            inputs: `Given the following agricultural conditions:\nArea: ${area}\nSeason: ${season}\nTemperature: ${temperature}\nSoil Type: ${soilType}\nRainfall: ${rainfall}\n\nPlease provide recommendations for suitable crops and necessary equipment.`,
            parameters: {
                max_new_tokens: 500,
            },
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data && data.length > 0 && data[0].generated_text) {
                setAdvice(data[0].generated_text);
            } else {
                setAdvice('Sorry, I couldn\'t generate a response.');
            }
        } catch (error) {
            console.error('Error:', error);
            setAdvice('An error occurred.');
        }

        setShowAdvice(true); // Show the advice after fetching
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
                        <Input type="text" id="area" value={area} onChange={(e) => setArea(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="season">Season</Label>
                        <Input type="text" id="season" value={season} onChange={(e) => setSeason(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="temperature">Temperature (°C/°F)</Label>
                        <Input type="text" id="temperature" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="soilType">Soil Type</Label>
                        <Input type="text" id="soilType" value={soilType} onChange={(e) => setSoilType(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rainfall">Rainfall (mm/inches)</Label>
                        <Input type="text" id="rainfall" value={rainfall} onChange={(e) => setRainfall(e.target.value)} />
                    </div>
                    <Button onClick={getCropAdvice}>Get Crop Advice</Button>
                    {showAdvice && (
                        <div className="mt-4">
                            <Card>
                                <CardContent>
                                    <pre>{advice}</pre>
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