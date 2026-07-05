export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          icon: string | null
          id: string
          name_ar: string
          name_en: string
          slug: string
          sort_order: number
        }
        Insert: {
          icon?: string | null
          id?: string
          name_ar: string
          name_en: string
          slug: string
          sort_order?: number
        }
        Update: {
          icon?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          generations_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          generations_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          generations_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          created_at: string
          final_prompt: string
          height: number | null
          id: string
          image_url: string | null
          model: string | null
          prompt_id: string | null
          provider: string | null
          seed: number | null
          status: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          final_prompt: string
          height?: number | null
          id?: string
          image_url?: string | null
          model?: string | null
          prompt_id?: string | null
          provider?: string | null
          seed?: number | null
          status?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          final_prompt?: string
          height?: number | null
          id?: string
          image_url?: string | null
          model?: string | null
          prompt_id?: string | null
          provider?: string | null
          seed?: number | null
          status?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generations_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          id: string
          locale: string
          plan: string
          role: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          id: string
          locale?: string
          plan?: string
          role?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          id?: string
          locale?: string
          plan?: string
          role?: string
          username?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          category_id: string | null
          copy_count: number
          created_at: string
          description_ar: string | null
          description_en: string | null
          generation_count: number
          id: string
          is_featured: boolean
          model: string | null
          preview_image_url: string | null
          prompt_display_ar: string
          prompt_text_en: string
          search_vector_ar: unknown
          search_vector_en: unknown
          slug: string
          status: string
          style: string | null
          tags: string[]
          title_ar: string
          title_en: string
          variables: Json
        }
        Insert: {
          category_id?: string | null
          copy_count?: number
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          generation_count?: number
          id?: string
          is_featured?: boolean
          model?: string | null
          preview_image_url?: string | null
          prompt_display_ar: string
          prompt_text_en: string
          search_vector_ar?: unknown
          search_vector_en?: unknown
          slug: string
          status?: string
          style?: string | null
          tags?: string[]
          title_ar: string
          title_en: string
          variables?: Json
        }
        Update: {
          category_id?: string | null
          copy_count?: number
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          generation_count?: number
          id?: string
          is_featured?: boolean
          model?: string | null
          preview_image_url?: string | null
          prompt_display_ar?: string
          prompt_text_en?: string
          search_vector_ar?: unknown
          search_vector_en?: unknown
          slug?: string
          status?: string
          style?: string | null
          tags?: string[]
          title_ar?: string
          title_en?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_windows: {
        Row: {
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          request_count?: number
          user_id: string
          window_start: string
        }
        Update: {
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_prompt_copy_count: {
        Args: { p_prompt_id: string }
        Returns: undefined
      }
      increment_prompt_generation_count: {
        Args: { p_prompt_id: string }
        Returns: undefined
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      try_increment_daily_usage: {
        Args: { p_daily_limit?: number; p_user_id: string }
        Returns: boolean
      }
      try_increment_rate_limit: {
        Args: {
          p_max_requests?: number
          p_user_id: string
          p_window_seconds?: number
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
