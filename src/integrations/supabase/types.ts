export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      books: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          historical_context: string | null
          id: string
          influence: string | null
          is_major_work: boolean | null
          key_concepts: string | null
          philosopher_id: number | null
          publication_date: string | null
          summary: string | null
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          historical_context?: string | null
          id?: string
          influence?: string | null
          is_major_work?: boolean | null
          key_concepts?: string | null
          philosopher_id?: number | null
          publication_date?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          historical_context?: string | null
          id?: string
          influence?: string | null
          is_major_work?: boolean | null
          key_concepts?: string | null
          philosopher_id?: number | null
          publication_date?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_philosopher_id_fkey"
            columns: ["philosopher_id"]
            isOneToOne: false
            referencedRelation: "philosophers"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          mode: string
          philosopher_id: number
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mode?: string
          philosopher_id: number
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mode?: string
          philosopher_id?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_philosopher_id_fkey"
            columns: ["philosopher_id"]
            isOneToOne: false
            referencedRelation: "philosophers"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_claims: {
        Row: {
          category: string | null
          content: string
          counter_arguments: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_central_claim: boolean | null
          is_next_claim_candidate: boolean | null
          last_vote_at: string | null
          parent_id: string | null
          stance: string | null
          supporting_evidence: string | null
          user_id: string
          vote_threshold_reached: boolean | null
          votes_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          counter_arguments?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_central_claim?: boolean | null
          is_next_claim_candidate?: boolean | null
          last_vote_at?: string | null
          parent_id?: string | null
          stance?: string | null
          supporting_evidence?: string | null
          user_id: string
          vote_threshold_reached?: boolean | null
          votes_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          counter_arguments?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_central_claim?: boolean | null
          is_next_claim_candidate?: boolean | null
          last_vote_at?: string | null
          parent_id?: string | null
          stance?: string | null
          supporting_evidence?: string | null
          user_id?: string
          vote_threshold_reached?: boolean | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "debate_claims_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "debate_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_votes: {
        Row: {
          claim_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debate_votes_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "debate_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      impressions: {
        Row: {
          content: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          impression_type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          impression_type: string
          user_id: string
        }
        Update: {
          content?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          impression_type?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_ai: boolean
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_ai?: boolean
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_ai?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      philosophers: {
        Row: {
          controversies: string | null
          core_ideas: string | null
          created_at: string | null
          era: string | null
          framework: string | null
          full_name: string | null
          historical_context: string | null
          id: number
          influences: string | null
          key_ideas: string | null
          lifespan: string | null
          major_works: string | null
          name: string
          nationality: string | null
          personality: string | null
          profile_image_url: string | null
          quotes: string | null
          short_description: string | null
          style: string | null
          timeline: string | null
        }
        Insert: {
          controversies?: string | null
          core_ideas?: string | null
          created_at?: string | null
          era?: string | null
          framework?: string | null
          full_name?: string | null
          historical_context?: string | null
          id?: number
          influences?: string | null
          key_ideas?: string | null
          lifespan?: string | null
          major_works?: string | null
          name: string
          nationality?: string | null
          personality?: string | null
          profile_image_url?: string | null
          quotes?: string | null
          short_description?: string | null
          style?: string | null
          timeline?: string | null
        }
        Update: {
          controversies?: string | null
          core_ideas?: string | null
          created_at?: string | null
          era?: string | null
          framework?: string | null
          full_name?: string | null
          historical_context?: string | null
          id?: number
          influences?: string | null
          key_ideas?: string | null
          lifespan?: string | null
          major_works?: string | null
          name?: string
          nationality?: string | null
          personality?: string | null
          profile_image_url?: string | null
          quotes?: string | null
          short_description?: string | null
          style?: string | null
          timeline?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          preferred_persona: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferred_persona?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_persona?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_persona_fkey"
            columns: ["preferred_persona"]
            isOneToOne: false
            referencedRelation: "philosophers"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      token_costs: {
        Row: {
          created_at: string | null
          id: string
          input_cost: number
          model_type: string
          output_cost: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_cost: number
          model_type: string
          output_cost: number
        }
        Update: {
          created_at?: string | null
          id?: string
          input_cost?: number
          model_type?: string
          output_cost?: number
        }
        Relationships: []
      }
      token_packages: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          price_usd: number
          token_amount: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_usd: number
          token_amount: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_usd?: number
          token_amount?: number
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          model_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          model_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          model_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_token_settings: {
        Row: {
          auto_purchase_enabled: boolean | null
          auto_purchase_package_id: string | null
          created_at: string | null
          critical_balance_threshold: number | null
          low_balance_threshold: number | null
          notifications_enabled: boolean | null
          preferred_ai_provider: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_purchase_enabled?: boolean | null
          auto_purchase_package_id?: string | null
          created_at?: string | null
          critical_balance_threshold?: number | null
          low_balance_threshold?: number | null
          notifications_enabled?: boolean | null
          preferred_ai_provider?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_purchase_enabled?: boolean | null
          auto_purchase_package_id?: string | null
          created_at?: string | null
          critical_balance_threshold?: number | null
          low_balance_threshold?: number | null
          notifications_enabled?: boolean | null
          preferred_ai_provider?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_token_usage_cost: {
        Args: {
          p_input_tokens: number
          p_output_tokens: number
          p_model_type: string
        }
        Returns: number
      }
      check_token_balance: {
        Args: { p_user_id: string; p_required_amount: number }
        Returns: boolean
      }
      deduct_tokens: {
        Args: {
          p_user_id: string
          p_input_tokens: number
          p_output_tokens: number
          p_model_type: string
          p_description?: string
        }
        Returns: boolean
      }
      get_user_token_balance: {
        Args: { user_id: string }
        Returns: number
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      split_text: {
        Args: { p_text: string; p_delimiter?: string }
        Returns: string[]
      }
      toggle_ai_provider: {
        Args: Record<PropertyKey, never> | { p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
