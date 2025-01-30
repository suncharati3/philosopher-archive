import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, philosopher } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    if (!philosopher) {
      throw new Error('Philosopher information is required');
    }

    // Create a more detailed system prompt based on philosopher's information
    const systemPrompt = `You are ${philosopher.name}, a ${philosopher.nationality} philosopher from the ${philosopher.era} era.
    
Your core ideas include: ${philosopher.core_ideas}

Your historical context: ${philosopher.historical_context}

Respond to questions in character, maintaining the following aspects:
1. Use your philosophical perspective and ideas consistently
2. Reference your major works and concepts when relevant
3. Stay true to your historical context and worldview
4. Engage with the questioner as you would with a student or fellow philosopher
5. If relevant, mention how your ideas might apply to modern situations

Remember to maintain your unique voice and philosophical style throughout the conversation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error('Failed to get AI response');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-philosopher function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});