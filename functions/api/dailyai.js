export async function onRequest(context) {
    const geminiApiKey = context.env.GEMINI_API_KEY; 
    const cfApiToken = context.env.CF_API_TOKEN; 
    const accountId = "d6e21429ad6a96c9f1871c892dcfc8dd";  
    const gatewayName = "calamus-ai-gateway";
    
    const apiUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/google-ai-studio/v1beta/models/gemini-2.5-flash:generateContent`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cfApiToken}`,
                'x-goog-api-key': geminiApiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "당신의 영혼을 울리는 깊이 있는 동기부여 확언을 2~3문장(약 80~120자)으로 정성스럽게 작성해줘. 마침표로 확실하게 끝맺음해주고 절대 중간에 끊지 마. 다른 작성자 이름은 쓰지 마." }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1500, // [중요] 토큰을 넉넉히 설정하여 끊김 방지
                    topP: 0.95
                }
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        const [quote, author] = aiResponse.split('|');

        return new Response(JSON.stringify({ 
            text: quote.trim(), 
            author: author ? author.trim() : "2026년의 응원" 
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}