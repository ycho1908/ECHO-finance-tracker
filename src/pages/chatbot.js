import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { Box, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";

export default function ChatBot() {
    const [history, setHistory] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [chat, setChat] = useState(null);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(false);

    const API_KEY = process.env.REACT_APP_GOOGLE_GEMINI_API_KEY;
    // console.log('API Key:', API_KEY); // to test the api keys
    const MODEL_NAME = "gemini-1.5-flash";

    const genAI = new GoogleGenerativeAI(API_KEY);

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    useEffect(() => {
        const initChat = async () => {
            try {
                const newChat = await genAI
                    .getGenerativeModel({ model: MODEL_NAME })
                    .startChat({
                        generationConfig,
                        safetySettings,
                        history: [],
                });
                setChat(newChat);

                const initialPrompt = "You are a finance tracking assistant. Please help the user with their finance-related queries. Give them advices in terms of how to manage budgets and not go over their goal of expenses.";

                await newChat.sendMessage(initialPrompt); 

                const initialMessage = {
                    role: 'bot',
                    text: "Hi, I'm Echo Support. How can I assist you today?",
                    timestamp: new Date(),
                };
                setHistory([initialMessage]);

            } catch (error) {
                setError('Failed to initialize chat. Please try again.')
            }
        };

        initChat();
    }, []);

    const handleSendMessage = async () => {
        try {
            const userMessage = {
                text: userInput,
                role: 'user',
                timestamp: new Date(),
            };

            setHistory((prevMessages) => [...prevMessages, userMessage]);
            setUserInput("");

            if (chat) {
                setLoading(true);
                const result = await chat.sendMessage(userInput);
                const botMessage = {
                    text: result.response.text(),
                    role: 'bot',
                    timestamp: new Date(),
                };

                setHistory((prevMessages) => [...prevMessages, botMessage]);
            }
        } catch (error) {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // could use this to have a theme change option
    const getThemeColors = () => {
        switch (theme) {
        case 'light':
            return {
            primary: '#ffffff',
            secondary: '#f3f4f6',
            accent: '#3b82f6',
            text: '#1f2937',
            };
        case 'dark':
            return {
            primary: '#1f2937',
            secondary: '#374151',
            accent: '#fbbf24',
            text: '#f3f4f6',
            };
        default:
            return {
            primary: '#ffffff',
            secondary: '#f3f4f6',
            accent: '#3b82f6',
            text: '#1f2937',
            };
        }
    };

    const { primary, secondary, accent, text, border } = getThemeColors();

    return (
        <>
        <div>
            <h2><em>Echo financial support chat</em></h2>
            <p>Echo's financial support chat can help you with any financial questions and advices regarding expenses.</p>
            <br/>
        </div>
        <Box width='70vw' height='70vh' display='flex' justifyContent='center' alignItems='center'
            sx={{
                backgroundColor: primary,
                color: text,
                transition: 'background-color 0.3s, color 0.3s',
                padding: 2
            }}
        >
            <Stack direction='column' width='100%' maxWidth='600px' height='80%' maxHeight='700px' border={`1px solid ${border}`} borderRadius={7} p={2} spacing={2}
                sx={{
                    backgroundColor: secondary,
                    borderColor: accent,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box display='flex' flexDirection='column' flexGrow={1} overflow='auto' padding={2}
                    sx={{
                        backgroundColor: secondary,
                        borderColor: accent,
                        border: `1px solid ${border}`,
                    }}
                >
                    <Stack direction='column' spacing={2} flexGrow={1} overflow='auto'>
                    {
                        history.map((msg, index) => (
                            <Box key={index} display={'flex'} justifyContent={msg.role === 'bot' ? 'flex-start' : 'flex-end'}>
                                <Box bgcolor={msg.role === 'bot' ? 'primary.main' : 'secondary.main'} color={'white'} borderRadius={7} p={2} maxWidth='75%'>
                                    <div>{msg.text}</div>
                                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign:msg.role === 'bot' ? 'left' : 'right'}}>
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </Box>
                            </Box>
                        ))}
                        {loading && (
                            <Box display='flex' justifyContent='center' alignItems='center' p={2}>
                                <CircularProgress size={20} />
                            </Box>
                        )}
                    </Stack>
                </Box>
                <Box component='footer' display='flex' justifyContent='center' alignItems='center' p={2}
                    sx={{
                        backgroundColor: secondary,
                        borderTop: `1px solid ${border}`,
                    }}
                >
                    <Stack direction='row' spacing={2} width='100%' maxWidth='600px'>
                        <TextField label='Message' fullWidth value={userInput} onChange={(e) => setUserInput(e.target.value)}
                            sx={{
                                input: { color: text },
                                label: { color: text },
                                backgroundColor: 'background.paper',
                                borderRadius: 5,
                            }}
                        />
                        <Button variant='contained' onClick={handleSendMessage}>Send</Button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
        </>
    );
}