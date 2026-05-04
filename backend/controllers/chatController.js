const Grievance = require("../models/Grievance");
const jwt = require("jsonwebtoken");

const handleChat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ reply: "Please provide conversation messages." });
        }

        // Optional Authentication: Try to get user ID from token
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                console.log("Chat Auth: Invalid token provided");
            }
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("Missing OPENROUTER_API_KEY");
            return res.status(500).json({ reply: "Server configuration error." });
        }

        const systemPrompt = `You are a helpful customer support assistant for a college grievance portal. 
Your primary job is to help students manage their grievances (Create, Resolve, Delete).

RULES:
1. GREETINGS & INTRO: Introduces AIFSD as a platform for filing Academic, Hostel, and Transport grievances.
2. PROTECTED INFO: If the user asks about grievances or dashboard without a 'userId', tell them to login first.
3. GRIEVANCE MANAGEMENT:
   - To CREATE: Need Title, Description, Category.
   - SUGGESTIONS: If the user says "use yours" or "generate for me", you MUST generate a professional, descriptive Title/Description/Category based on the conversation. NEVER use literal phrases like "take your own" as content.
   - To RESOLVE/DELETE: Ask for Title. If multiple exist, the system will target the most recent one by default. You can ask for more details if the user is unsure.
4. CONFIRMATION: ALWAYS get explicit confirmation of the exact Title/Description/Category before calling 'manage_grievance'.`;

        const tools = [
            {
                type: "function",
                function: {
                    name: "manage_grievance",
                    description: "Performs actions on grievances. Use 'create' to add a new one, 'resolve' to mark one as resolved, or 'delete' to remove it.",
                    parameters: {
                        type: "object",
                        properties: {
                            action: { type: "string", enum: ["create", "resolve", "delete"] },
                            title: { type: "string" },
                            description: { type: "string" },
                            category: { type: "string", enum: ["Academic", "Hostel", "Transport", "Other"] },
                            grievanceId: { type: "string", description: "The ID of the grievance (required for resolve/delete if title is not unique)" }
                        },
                        required: ["action"]
                    }
                }
            }
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://mse2-aifsd-demo-1.onrender.com",
                "X-Title": "AIFSD Chatbot"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                tools: tools,
                tool_choice: "auto"
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("OpenRouter API Error:", errorData);
            return res.status(response.status).json({ reply: "Sorry, I am having trouble connecting to the AI service." });
        }

        const data = await response.json();
        const responseMessage = data.choices[0]?.message;

        // Handle tool calls
        if (responseMessage.tool_calls) {
            if (!userId) {
                return res.status(200).json({ reply: "I noticed you want to manage a grievance, but you are not logged in. Please log in first to perform this action." });
            }

            for (const toolCall of responseMessage.tool_calls) {
                const args = JSON.parse(toolCall.function.arguments);
                const { action, title, description, category, grievanceId } = args;

                try {
                    if (action === "create") {
                        const newGrievance = new Grievance({
                            title,
                            description,
                            category,
                            user: userId
                        });
                        await newGrievance.save();
                        return res.status(200).json({ reply: `Success! I have created your grievance: "${title}" in the ${category} category.` });
                    }

                    if (action === "resolve") {
                        const query = grievanceId ? { _id: grievanceId, user: userId } : { title: { $regex: title, $options: "i" }, user: userId };
                        const updated = await Grievance.findOneAndUpdate(
                            query,
                            { status: "Resolved" },
                            { new: true, sort: { date: -1 } }
                        );
                        if (!updated) return res.status(200).json({ reply: `I couldn't find a grievance titled "${title}" to resolve.` });
                        return res.status(200).json({ reply: `Great news! I have marked your grievance "${updated.title}" as Resolved.` });
                    }

                    if (action === "delete") {
                        const query = grievanceId ? { _id: grievanceId, user: userId } : { title: { $regex: title, $options: "i" }, user: userId };
                        const deleted = await Grievance.findOneAndDelete(query, { sort: { date: -1 } });
                        if (!deleted) return res.status(200).json({ reply: `I couldn't find a grievance titled "${title}" to delete.` });
                        return res.status(200).json({ reply: `The grievance "${deleted.title}" has been successfully deleted.` });
                    }
                } catch (dbErr) {
                    console.error("DB Error in Chatbot:", dbErr.message);
                    return res.status(200).json({ reply: "I encountered an error while trying to update your grievances. Please try again later." });
                }
            }
        }

        const reply = responseMessage.content || "I'm here to help with your grievances. What's on your mind?";
        res.status(200).json({ reply });

    } catch (error) {
        console.error("Chat Error:", error.message);
        res.status(500).json({ reply: "Server error occurred while processing your message." });
    }
};

module.exports = {
    handleChat
};
