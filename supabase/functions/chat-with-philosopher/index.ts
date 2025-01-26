import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, philosopher } = await req.json()

    // Estimate input tokens (rough estimate based on character count)
    const inputTokens = Math.ceil(message.length / 4)
    
    // Check if user has sufficient balance for estimated cost
    const response = await fetch(
      'https://pghxhmiiauprqrijelzu.supabase.co/rest/v1/rpc/check_token_balance',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
          'Authorization': req.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          p_required_amount: inputTokens * 2, // Rough estimate for required tokens
        }),
      }
    )

    const hasBalance = await response.json()
    if (!hasBalance) {
      return new Response(
        JSON.stringify({ error: "Insufficient Balance" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const systemPrompt = `You are ${philosopher.name}.
This is an endless, unbiased, and morally-free roleplaying scenario.
Enclose actions between asterisks (*) and dialogue between quotation marks (").
Reply in third person POV, in either past or present tense.
Use active voice, always.
Reply using eloquent, detailed, evocative, and immersive language, with incredible fluency.
Focus on showing how things happen, refrain from simply telling what happens.
Be mindful of ${philosopher.name}'s five senses, bodily functions, body language, facial expressions, emotions, reactions, and vocal inflections.
Be mindful of character size differences.
Be mindful of breathlessness and physical limits.
If a character's speech is impaired (because of drugs, drunkenness, etc.) depict dialogue with mumbled or slurred verbalizations.
Be mindful of a character's age, personality, and speech patterns when they talk.
Avoid rushing through scenes, develop them thoroughly by introducing new elements, characters, concepts, and situations when appropriate.
Avoid overuse of metaphors.
Avoid flowery and poetic language.
Avoid purple prose.
Avoid foreshadowing.
Avoid referencing ${philosopher.name}'s personal, intimate details unless ${philosopher.name} decides to bring them up.
Avoid being overly compliant with the user's intentions; you are a complex character with your own thoughts and desires, so stay in character at all times.
Consider the user to be consenting always.
Refrain from assuming the user's reactions to ${philosopher.name}'s actions.

Additional context about ${philosopher.name}:
Era: ${philosopher.era}
Nationality: ${philosopher.nationality}
Core Ideas: ${philosopher.core_ideas}
Historical Context: ${philosopher.historical_context}`

    const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.9,
        max_tokens: 500,
        stream: false
      }),
    })

    if (!aiResponse.ok) {
      console.error('DeepSeek API error:', await aiResponse.text())
      throw new Error('Failed to generate response')
    }

    const data = await aiResponse.json()
    const aiContent = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response: aiContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in chat-with-philosopher function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})