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
    
    // Verify API key exists
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY')
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY not found')
      throw new Error('API key configuration error')
    }

    // Get user ID from JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    const token = authHeader.replace('Bearer ', '')
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))
    const userId = tokenPayload.sub

    // Calculate estimated tokens (rough estimation)
    const inputTokens = Math.ceil(message.length / 4) // Rough estimate of 4 chars per token
    const expectedOutputTokens = 500 // Based on max_tokens setting
    const estimatedTotalTokens = inputTokens + expectedOutputTokens

    console.log(`Estimated tokens - Input: ${inputTokens}, Output: ${expectedOutputTokens}, Total: ${estimatedTotalTokens}`)

    // Calculate token cost first
    const tokenCostResponse = await fetch(
      'https://pghxhmiiauprqrijelzu.supabase.co/rest/v1/rpc/calculate_token_usage_cost',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
          'Authorization': req.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          p_input_tokens: inputTokens,
          p_output_tokens: expectedOutputTokens,
          p_model_type: 'deepseek-chat'
        }),
      }
    )

    const tokenCost = await tokenCostResponse.json()
    console.log('Calculated token cost:', tokenCost)

    // Check balance with calculated cost
    const balanceResponse = await fetch(
      'https://pghxhmiiauprqrijelzu.supabase.co/rest/v1/rpc/check_token_balance',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
          'Authorization': req.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          p_user_id: userId,
          p_required_amount: tokenCost
        }),
      }
    )

    const hasBalance = await balanceResponse.json()
    if (!hasBalance) {
      return new Response(
        JSON.stringify({ error: "Insufficient Balance" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Making DeepSeek API request...')
    
    try {
      // Add a small delay before making the API request (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
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

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text()
        console.error('DeepSeek API error:', errorText)
        
        if (errorText.includes("Insufficient Balance")) {
          return new Response(
            JSON.stringify({ error: "DeepSeek API balance insufficient. Please try again later." }),
            { 
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
        
        throw new Error(`DeepSeek API error: ${errorText}`)
      }

      const data = await aiResponse.json()
      console.log('DeepSeek API response received successfully')

      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected API response format:', data)
        throw new Error('Invalid API response format')
      }

      // Deduct tokens after successful API call
      const deductResponse = await fetch(
        'https://pghxhmiiauprqrijelzu.supabase.co/rest/v1/rpc/deduct_tokens',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': req.headers.get('Authorization') || '',
          },
          body: JSON.stringify({
            p_user_id: userId,
            p_input_tokens: inputTokens,
            p_output_tokens: data.usage?.completion_tokens || expectedOutputTokens,
            p_model_type: 'deepseek-chat',
            p_description: `Chat with ${philosopher.name}`
          }),
        }
      )

      if (!deductResponse.ok) {
        console.error('Error deducting tokens:', await deductResponse.text())
        // Continue anyway since we got the response
      }

      return new Response(
        JSON.stringify({ response: data.choices[0].message.content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (apiError) {
      console.error('Error calling DeepSeek API:', apiError)
      throw new Error(`DeepSeek API error: ${apiError.message}`)
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