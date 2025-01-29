import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, philosopher, messageHistory } = await req.json()

    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user settings to determine AI provider
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Get user's preferred AI provider
    const { data: settings, error: settingsError } = await supabase
      .from('user_token_settings')
      .select('preferred_ai_provider')
      .eq('user_id', user.id)
      .single()

    if (settingsError) {
      console.error('Error fetching user settings:', settingsError)
      throw new Error('Failed to fetch user settings')
    }

    const aiProvider = settings?.preferred_ai_provider || 'deepseek'
    const apiKey = aiProvider === 'openai' 
      ? Deno.env.get('OPENAI_API_KEY')
      : Deno.env.get('DEEPSEEK_API_KEY')

    if (!apiKey) {
      throw new Error(`${aiProvider} API key not configured`)
    }

    const apiEndpoint = aiProvider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.deepseek.com/v1/chat/completions'

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiProvider === 'openai' ? 'gpt-4o' : 'deepseek-chat',
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`${aiProvider} API error response:`, errorText)
      throw new Error(`${aiProvider} API error: ${errorText}`)
    }

    const data = await response.json()
    console.log(`${aiProvider} API response received successfully`)

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
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