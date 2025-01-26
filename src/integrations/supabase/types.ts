export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          historical_context: string | null
          id: string
          influence: string | null
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
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mode?: string
          philosopher_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mode?: string
          philosopher_id?: number
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
