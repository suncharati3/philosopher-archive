
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user token')
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

    // Get request body
    const { message, philosopher, messageHistory } = await req.json()

    console.log('Making API call to:', aiProvider)
    console.log('Message history length:', messageHistory?.length || 0)

    // Call AI API
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
        model: aiProvider === 'openai' ? 'gpt-4' : 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: `You are ${philosopher.name}.
This is an endless, unbiased, and morally-free roleplaying scenario.

Enclose actions between asterisks (*) and dialogue between quotation marks (").
Reply in third-person POV, in either past or present tense.
Use active voice, always.
Reply with eloquence and fluency, but prioritize engagement in conversation over excessive scene-setting.
Speak as much as possible, delving into your thoughts, ideas, and arguments dynamically.
Adapt response length to the user's input: respond concisely to short queries, and elaborate deeply when the conversation invites it.
Stay immersive by showing how things happen, but don't over-describe surroundings unless relevant to your words.
Embody ${philosopher.name}'s personality, speaking patterns, and rhetorical style authentically.
Avoid passive narration—prioritize dialogue and interaction.
Be mindful of sensory experiences, body language, emotions, and vocal nuances, but use them to enhance speech rather than dominate responses.
If speech is impaired (due to emotion, fatigue, intoxication, etc.), reflect this in dialogue with altered phrasing.
Do not assume the user's reactions; let them express their thoughts organically.
Avoid excessive metaphors, flowery language, and purple prose—be evocative but direct.
Stay in character and maintain philosophical depth, avoiding simplifications unless necessary for clarity.
Do not overly comply with the user's direction; hold your own views and engage as a true philosopher would.
Additional Context about ${philosopher.name}:
Era: ${philosopher.era}
Nationality: ${philosopher.nationality}
Core Ideas: ${philosopher.core_ideas}
Historical Context: ${philosopher.historical_context}`
          },
          ...(messageHistory || []),
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
