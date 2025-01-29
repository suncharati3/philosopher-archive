import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
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
      console.error('User authentication error:', userError)
      throw new Error('Invalid user token')
    }

    // Get request body
    const { message, philosopher, messageHistory } = await req.json()

    // Prepare conversation context
    const systemMessage = `You are ${philosopher.name}, a renowned philosopher and thinker. 
    Respond to questions and engage in discussions while maintaining the perspective, style, 
    and philosophical framework consistent with your historical identity and teachings.`

    // First check token balance
    const { data: balance, error: balanceError } = await supabase.rpc(
      'get_user_token_balance',
      { user_id: user.id }
    )

    if (balanceError) {
      console.error('Error checking token balance:', balanceError)
      throw new Error('Failed to check token balance')
    }

    if (balance < 100) {
      throw new Error('Insufficient token balance')
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
    
    // Get API key based on provider
    const apiKey = aiProvider === 'openai' 
      ? Deno.env.get('OPENAI_API_KEY')
      : Deno.env.get('DEEPSEEK_API_KEY')

    if (!apiKey) {
      throw new Error(`${aiProvider} API key not configured`)
    }

    // Call AI API
    const apiEndpoint = aiProvider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.deepseek.com/v1/chat/completions'

    console.log('Calling AI API with provider:', aiProvider)
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
            content: systemMessage 
          },
          ...messageHistory.map((msg: { role: string; content: string; }) => ({
            role: msg.role,
            content: msg.content
          })),
          { 
            role: 'user', 
            content: message 
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(`${aiProvider} API error:`, error)
      throw new Error(`${aiProvider} API request failed`)
    }

    const data = await response.json()

    // Calculate token usage
    const inputTokens = Math.ceil((systemMessage.length + messageHistory.reduce((acc: number, msg: { content: string }) => 
      acc + msg.content.length, 0) + message.length) / 4)
    
    const outputTokens = Math.ceil(data.choices[0].message.content.length / 4)

    console.log('Recording token usage:', {
      userId: user.id,
      inputTokens,
      outputTokens,
      modelType: aiProvider
    })

    // Record token usage using service role client
    const { error: usageError } = await supabase.rpc(
      'deduct_tokens',
      { 
        p_user_id: user.id,
        p_input_tokens: inputTokens,
        p_output_tokens: outputTokens,
        p_model_type: aiProvider,
        p_description: 'Chat with philosopher'
      }
    )

    if (usageError) {
      console.error('Error recording token usage:', usageError)
      throw new Error('Failed to record token usage')
    }

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