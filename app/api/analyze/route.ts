export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, slowdown, bottleneck, clarity, description } = body;

    const apiKey = process.env.GROQ_API_KEY;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `You are a senior workplace consultant. A professional has completed a self-assessment. 
Give them a detailed, specific, and honest diagnosis based only on their data.

Role: ${role}
Biggest slowdown: ${slowdown}
Main bottleneck: ${bottleneck}
Task clarity: ${clarity}
Their own words: ${description}

Rules:
- Be specific — reference their exact answers
- Be detailed — each point should be 2-3 sentences
- No generic advice — every recommendation must be actionable today
- Write like a senior consultant, not a chatbot

Respond in exactly this format:

TOP ISSUES:
1. [Issue title]: [2-3 sentence detailed explanation referencing their specific data]
2. [Issue title]: [2-3 sentence detailed explanation]
3. [Issue title]: [2-3 sentence detailed explanation]

ROOT CAUSE:
[2-3 sentences identifying the single underlying problem connecting all their issues. Be direct and specific.]

ACTIONS:
- Tomorrow: [one specific action they can take tomorrow, with exact details]
- This week: [one specific action for this week, with exact details]
- With their team: [one specific conversation or change to raise with their manager or team]

WORK STYLE INSIGHT:
[2-3 sentences describing how this person likely works based on their answers, what their strengths probably are, and what pattern is holding them back]`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      const apiError =
        data.error?.message ||
        `Groq API error (status ${response.status})`;
      return Response.json({ error: apiError }, { status: 502 });
    }

    const text = data.choices[0].message.content;
    return Response.json({ result: text });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
