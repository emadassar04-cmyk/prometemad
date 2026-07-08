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
      anon_rate_limit_windows: {
        Row: {
          rate_key: string
          request_count: number
          window_start: string
        }
        Insert: {
          rate_key: string
          request_count?: number
          window_start: string
        }
        Update: {
          rate_key?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      assistant_sessions: {
        Row: {
          created_at: string
          id: string
          led_to_generation: boolean
          messages: Json
          recommended_slug: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          led_to_generation?: boolean
          messages?: Json
          recommended_slug?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          led_to_generation?: boolean
          messages?: Json
          recommended_slug?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_usage: {
        Row: {
          usage_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          usage_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          usage_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      brand_kits: {
        Row: {
          business_name: string | null
          colors: Json
          created_at: string
          font: string | null
          logo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          colors?: Json
          created_at?: string
          font?: string | null
          logo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          colors?: Json
          created_at?: string
          font?: string | null
          logo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          category_id: string | null
          created_at: string
          end_date: string
          id: string
          name_ar: string
          name_en: string
          start_date: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          name_ar: string
          name_en: string
          start_date: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          name_ar?: string
          name_en?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
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
      enhance_usage: {
        Row: {
          enhance_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          enhance_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          enhance_count?: number
          usage_date?: string
          user_id?: string
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
      feature_settings: {
        Row: {
          config: Json
          key: string
          updated_at: string
        }
        Insert: {
          config?: Json
          key: string
          updated_at?: string
        }
        Update: {
          config?: Json
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      generation_likes: {
        Row: {
          anon_id: string
          created_at: string
          generation_id: string
        }
        Insert: {
          anon_id: string
          created_at?: string
          generation_id: string
        }
        Update: {
          anon_id?: string
          created_at?: string
          generation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_likes_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          created_at: string
          error: string | null
          final_prompt: string
          height: number | null
          id: string
          image_url: string | null
          is_curated: boolean
          is_public: boolean
          like_count: number
          model: string | null
          moderation_status: string
          prompt_id: string | null
          provider: string | null
          seed: number | null
          status: string
          used_brand_kit: boolean
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          final_prompt: string
          height?: number | null
          id?: string
          image_url?: string | null
          is_curated?: boolean
          is_public?: boolean
          like_count?: number
          model?: string | null
          moderation_status?: string
          prompt_id?: string | null
          provider?: string | null
          seed?: number | null
          status?: string
          used_brand_kit?: boolean
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          error?: string | null
          final_prompt?: string
          height?: number | null
          id?: string
          image_url?: string | null
          is_curated?: boolean
          is_public?: boolean
          like_count?: number
          model?: string | null
          moderation_status?: string
          prompt_id?: string | null
          provider?: string | null
          seed?: number | null
          status?: string
          used_brand_kit?: boolean
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
      image_to_prompt_usage: {
        Row: {
          usage_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          usage_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          usage_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      personal_generations: {
        Row: {
          created_at: string
          id: string
          result_image_path: string | null
          source_image_path: string
          status: string
          style_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          result_image_path?: string | null
          source_image_path: string
          status?: string
          style_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          result_image_path?: string | null
          source_image_path?: string
          status?: string
          style_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_generations_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "personal_styles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_photos_daily_usage: {
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
      personal_styles: {
        Row: {
          category: string
          created_at: string
          example_after_url: string | null
          example_before_url: string | null
          id: string
          is_active: boolean
          prompt_body: string
          share_text_ar: string
          slug: string
          sort_order: number
          tagline_ar: string
          title_ar: string
          title_en: string
          usage_count: number
        }
        Insert: {
          category: string
          created_at?: string
          example_after_url?: string | null
          example_before_url?: string | null
          id?: string
          is_active?: boolean
          prompt_body: string
          share_text_ar: string
          slug: string
          sort_order?: number
          tagline_ar: string
          title_ar: string
          title_en: string
          usage_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          example_after_url?: string | null
          example_before_url?: string | null
          id?: string
          is_active?: boolean
          prompt_body?: string
          share_text_ar?: string
          slug?: string
          sort_order?: number
          tagline_ar?: string
          title_ar?: string
          title_en?: string
          usage_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          daily_limit_override: number | null
          id: string
          is_banned: boolean
          locale: string
          plan: string
          referral_code: string
          role: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          daily_limit_override?: number | null
          id: string
          is_banned?: boolean
          locale?: string
          plan?: string
          referral_code?: string
          role?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          daily_limit_override?: number | null
          id?: string
          is_banned?: boolean
          locale?: string
          plan?: string
          referral_code?: string
          role?: string
          username?: string | null
        }
        Relationships: []
      }
      prompt_ratings: {
        Row: {
          created_at: string
          prompt_id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          prompt_id: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          prompt_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_ratings_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
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
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value_ar: string | null
          value_en: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          id: string
          locale: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          locale?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          locale?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      workspace_daily_usage: {
        Row: {
          generations_count: number
          usage_date: string
          workspace_id: string
        }
        Insert: {
          generations_count?: number
          usage_date?: string
          workspace_id: string
        }
        Update: {
          generations_count?: number
          usage_date?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_daily_usage_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          joined_at: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          joined_at?: string
          role?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          decided_at: string | null
          id: string
          invite_code: string
          name: string
          owner_id: string
          status: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          id?: string
          invite_code?: string
          name: string
          owner_id: string
          status?: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          id?: string
          invite_code?: string
          name?: string
          owner_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_dashboard_stats: { Args: never; Returns: Json }
      admin_list_users: { Args: never; Returns: Json }
      approve_workspace: { Args: { p_workspace_id: string }; Returns: boolean }
      current_workspace_id: { Args: never; Returns: string }
      get_total_generation_count: { Args: never; Returns: number }
      increment_personal_style_usage: {
        Args: { p_style_id: string }
        Returns: undefined
      }
      increment_prompt_copy_count: {
        Args: { p_prompt_id: string }
        Returns: undefined
      }
      increment_prompt_generation_count: {
        Args: { p_prompt_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      join_workspace: { Args: { p_invite_code: string }; Returns: boolean }
      leave_workspace: { Args: never; Returns: boolean }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      redeem_referral: { Args: { p_referral_code: string }; Returns: boolean }
      reject_workspace: { Args: { p_workspace_id: string }; Returns: boolean }
      request_workspace: { Args: { p_name: string }; Returns: string }
      toggle_generation_like: {
        Args: { p_anon_id: string; p_generation_id: string }
        Returns: {
          like_count: number
          liked: boolean
        }[]
      }
      try_increment_anon_rate_limit: {
        Args: {
          p_key: string
          p_max_requests?: number
          p_window_seconds?: number
        }
        Returns: boolean
      }
      try_increment_assistant_usage: {
        Args: { p_daily_limit?: number; p_user_id: string }
        Returns: boolean
      }
      try_increment_daily_usage: {
        Args: { p_daily_limit?: number; p_user_id: string }
        Returns: boolean
      }
      try_increment_enhance_usage: {
        Args: { p_daily_limit?: number; p_user_id: string }
        Returns: boolean
      }
      try_increment_image_to_prompt_usage: {
        Args: { p_daily_limit?: number; p_user_id: string }
        Returns: boolean
      }
      try_increment_personal_photos_daily_usage: {
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
