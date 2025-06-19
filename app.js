const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Plant = require('./Schemas/Plant');
require('dotenv').config();
const cors = require('cors');
const UserRouter = require('./routes/User');
const connection = require('./connections/DB');


connection(process.env.MONGO_URL);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/user/', require('./routes/User'));
app.use('/api/plants/', require('./routes/PlantsData'));
app.use('/api/cart/', require('./routes/Cart'));
app.use('/api/orders/', require('./routes/Orders'))


app.get('/', (req, res) => {
    res.json({ hi: 'Hello, World!' });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/api/addData', async (req, res) => {
    const data = await insertData();
    res.json({ message: 'Data inserted successfully', data });
});


async function insertData() {
    const plants = [
        {
            id: 1,
            name: "Monstera Deliciosa",
            shortDescription: "Beautiful split-leaf tropical plant",
            fullDescription: "The Monstera Deliciosa is a stunning tropical plant known for its large, split leaves that create beautiful natural patterns. Perfect for adding a touch of the jungle to your home.",
            image: [
                "https://i.ibb.co/pBQYHNqb/Gemini-Generated-Image-jc95ocjc95ocjc95.png",
                "https://i.ibb.co/v6Nv1f9D/Gemini-Generated-Image-jc95oajc95oajc95.png",
                "https://i.ibb.co/jktvyf0L/Gemini-Generated-Image-jc95objc95objc95.png",
                "https://i.ibb.co/tMgNcTyZ/Gemini-Generated-Image-jc95o9jc95o9jc95.png",
                "https://i.ibb.co/Xrs6nDTQ/Gemini-Generated-Image-jc95o8jc95o8jc95.png",
            ],
            basePrice: 45,
            sizeInfo: {
                small: { potSize: "6 inch diameter", plantHeight: "12-18 inches", description: "Perfect for desks and small spaces", price: 40 },
                medium: { potSize: "8 inch diameter", plantHeight: "24-30 inches", description: "Great for side tables and shelves", price: 50 },
                large: { potSize: "12 inch diameter", plantHeight: "36-48 inches", description: "Statement piece for floors and corners", price: 60 }
            },
            characteristics: [
                "Loves bright, indirect light",
                "Water when soil feels dry",
                "Grows up to 8 feet indoors",
                "Air purifying qualities",
                "Pet-friendly with caution"
            ],
            potColors: [
                { name: "SaddleBrown", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 10 },

                {
                    name: "DarkSlateGray", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 9
                },

                {
                    name: "Black", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 20
                },

                {
                    name: "White", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 25
                },

                {
                    name: "peru", asmallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 15
                }]
        },
        {
            id: 2,
            name: "Snake Plant",
            shortDescription: "Low-maintenance air purifier",
            fullDescription: "The Snake Plant, also known as Sansevieria, is perfect for beginners. Its striking upright leaves and incredible resilience make it an ideal choice for any space.",
            image: [
                "https://i.ibb.co/wFt5QKb9/Gemini-Generated-Image-8ppxyv8ppxyv8ppx.png",
                "https://i.ibb.co/YT1L795w/Gemini-Generated-Image-n55v6n55v6n55v6n.png",
                "https://i.ibb.co/0yq26V12/Gemini-Generated-Image-8ppxyu8ppxyu8ppx.png",
                "https://i.ibb.co/nqWsj0Z9/Gemini-Generated-Image-n55v5n55v5n55v5n.png",
                "https://i.ibb.co/WpdwhqRD/Gemini-Generated-Image-8ppxyt8ppxyt8ppx.png"
            ],
            basePrice: 35,
            sizeInfo: {
                small: { potSize: "5 inch diameter", plantHeight: "8-12 inches", description: "Compact size for any corner", price: 40 },
                medium: { potSize: "7 inch diameter", plantHeight: "18-24 inches", description: "Perfect tabletop companion", price: 50 },
                large: { potSize: "10 inch diameter", plantHeight: "30-36 inches", description: "Bold floor statement piece", price: 60 }
            },
            characteristics: [
                "Thrives in low light",
                "Water every 2-3 weeks",
                "Excellent air purifier",
                "Very low maintenance",
                "Grows slowly and steadily"
            ],
            potColors: [
                { name: "SaddleBrown", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 10 },

                {
                    name: "DarkSlateGray", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 9
                },

                {
                    name: "Black", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 20
                },

                {
                    name: "White", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 25
                },

                {
                    name: "peru", asmallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 15
                }]
        },
        {
            id: 3,
            name: "Fiddle Leaf Fig",
            shortDescription: "Statement plant with large glossy leaves",
            fullDescription: "The Fiddle Leaf Fig is a dramatic statement plant with large, violin-shaped leaves. It's perfect for creating a bold focal point in any room.",
            image: [
                "https://i.ibb.co/2368Vt0n/Gemini-Generated-Image-308u2d308u2d308u.png",
                "https://i.ibb.co/TB8ysgJZ/Gemini-Generated-Image-308u2b308u2b308u.png",
                "https://i.ibb.co/JWhg3Srq/Gemini-Generated-Image-308u2c308u2c308u.png",
                "https://i.ibb.co/8g27mwqM/Gemini-Generated-Image-308u2e308u2e308u.png",
                "https://i.ibb.co/d0C3tG33/Gemini-Generated-Image-308u2a308u2a308u.png"
            ],
            basePrice: 65,
            sizeInfo: {
                small: { potSize: "6 inch diameter", plantHeight: "18-24 inches", description: "Young plant with room to grow", price: 40 },
                medium: { potSize: "9 inch diameter", plantHeight: "36-48 inches", description: "Established beauty for any room", price: 50 },
                large: { potSize: "14 inch diameter", plantHeight: "60-72 inches", description: "Magnificent tree for spacious areas", price: 60 }
            },
            characteristics: [
                "Needs bright, filtered light",
                "Water when top soil is dry",
                "Can grow up to 10 feet tall",
                "Loves consistent watering",
                "Dramatic architectural presence"
            ],
            potColors: [
                { name: "SaddleBrown", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 10 },

                {
                    name: "DarkSlateGray", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 9
                },

                {
                    name: "Black", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 20
                },

                {
                    name: "White", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 25
                },

                {
                    name: "peru", asmallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 15
                }]
        },
        {
            id: 4,
            name: "Peace Lily",
            shortDescription: "Elegant flowering houseplant",
            fullDescription: "The Peace Lily is an elegant plant that produces beautiful white flowers. It's known for its air-purifying qualities and ability to thrive in lower light conditions.",
            image: [
                "https://i.ibb.co/h122Zstq/Gemini-Generated-Image-2kl7nv2kl7nv2kl7.png",
                "https://i.ibb.co/rRPXZBRh/Gemini-Generated-Image-2kl7nr2kl7nr2kl7.png",
                "https://i.ibb.co/spVsb9b3/Gemini-Generated-Image-2kl7nu2kl7nu2kl7.png",
                "https://i.ibb.co/39PzfVyj/Gemini-Generated-Image-2kl7ns2kl7ns2kl7.png",
                "https://i.ibb.co/8nZ1HdTx/Gemini-Generated-Image-2kl7nt2kl7nt2kl7.png"
            ],
            basePrice: 40,
            sizeInfo: {
                small: { potSize: "5 inch diameter", plantHeight: "12-15 inches", description: "Delicate beauty for intimate spaces", price: 40 },
                medium: { potSize: "7 inch diameter", plantHeight: "20-25 inches", description: "Perfect flowering companion", price: 50 },
                large: { potSize: "10 inch diameter", plantHeight: "30-35 inches", description: "Lush flowering centerpiece", price: 60 }
            },
            characteristics: [
                "Tolerates low to medium light",
                "Blooms beautiful white flowers",
                "Excellent air purifier",
                "Droops when thirsty",
                "Non-toxic to pets"
            ],
            potColors: [
                { name: "SaddleBrown", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 10 },

                {
                    name: "DarkSlateGray", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 9
                },

                {
                    name: "Black", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 20
                },

                {
                    name: "White", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 25
                },

                {
                    name: "peru", asmallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 15
                }]
        },
        {
            id: 5,
            name: "Rubber Plant",
            shortDescription: "Glossy-leaved tree with burgundy accents",
            fullDescription: "The Rubber Plant features thick, glossy leaves with beautiful burgundy undersides. It's a robust plant that can grow into an impressive indoor tree.",
            image: [
                "https://i.ibb.co/PvRhq1Hf/Gemini-Generated-Image-hvs8vchvs8vchvs8.png",
                "https://i.ibb.co/DD8WTTTz/Gemini-Generated-Image-hvs8vahvs8vahvs8.png",
                "https://i.ibb.co/JWXQLSyb/Gemini-Generated-Image-hvs8vehvs8vehvs8.png",
                "https://i.ibb.co/5xFJqKCx/Gemini-Generated-Image-hvs8vbhvs8vbhvs8.png",
                "https://i.ibb.co/8LpqQXBr/Gemini-Generated-Image-hvs8vdhvs8vdhvs8.png"
            ],
            basePrice: 50,
            sizeInfo: {
                small: { potSize: "6 inch diameter", plantHeight: "15-20 inches", description: "Young glossy beauty", price: 40 },
                medium: { potSize: "8 inch diameter", plantHeight: "28-35 inches", description: "Developing into a stunning tree", price: 50 },
                large: { potSize: "12 inch diameter", plantHeight: "45-55 inches", description: "Majestic indoor tree specimen", price: 60 }
            },
            characteristics: [
                "Bright, indirect light preferred",
                "Water when soil surface is dry",
                "Grows into a beautiful tree",
                "Glossy, thick leaves",
                "Easy to propagate"
            ],
            potColors: [
                { name: "SaddleBrown", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 10 },

                {
                    name: "DarkSlateGray", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 9
                },

                {
                    name: "Black", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 20
                },

                {
                    name: "White", smallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 25
                },

                {
                    name: "peru", asmallPotsCount: 10, mediumPotsCount: 10, largePotsCount: 10, price: 15
                }]
        }
    ]

    const plantsData  = await Plant.insertMany(plants);
    console.log("Data inserted successfully");
    return plantsData;
}

