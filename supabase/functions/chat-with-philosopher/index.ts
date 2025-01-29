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
    const { message, philosopher, messageHistory } = await req.json()
    
    // Get API keys
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!deepseekApiKey || !openaiApiKey) {
      console.error('Missing required API keys')
      throw new Error('API key configuration error')
    }

    // Get user token settings to determine provider
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: settings, error: settingsError } = await supabase
      .from('user_token_settings')
      .select('preferred_ai_provider')
      .eq('user_id', user.id)
      .single()

    if (settingsError) throw settingsError

    const provider = settings?.preferred_ai_provider || 'deepseek'
    console.log('Using AI provider:', provider)

    try {
      // Add a small delay before making the API request (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response;
      if (provider === 'deepseek') {
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { 
                role: 'system', 
                content: `You are ${philosopher.name}.
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
              },
              ...messageHistory,
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
            stream: false,
            top_p: 0.9,
            frequency_penalty: 0.5,
            presence_penalty: 0.5
          }),
        })
      } else {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { 
                role: 'system', 
                content: `You are ${philosopher.name}.
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
              },
              ...messageHistory,
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
            stream: false,
          }),
        })
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`${provider} API error response:`, errorText)
        throw new Error(`${provider} API error: ${errorText}`)
      }

      const data = await response.json()
      console.log(`${provider} API response received successfully`)

      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected API response format:', data)
        throw new Error('Invalid API response format')
      }

      return new Response(
        JSON.stringify({ response: data.choices[0].message.content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (apiError) {
      console.error(`Error calling ${provider} API:`, apiError)
      throw new Error(`${provider} API error: ${apiError.message}`)
    }
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