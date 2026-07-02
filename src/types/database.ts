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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      day_logs: {
        Row: {
          created_at: string
          date: string
          day_type: Database["public"]["Enums"]["day_type"]
          id: string
          notes: string | null
          user_id: string
          water_liters: number | null
        }
        Insert: {
          created_at?: string
          date: string
          day_type?: Database["public"]["Enums"]["day_type"]
          id?: string
          notes?: string | null
          user_id: string
          water_liters?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          day_type?: Database["public"]["Enums"]["day_type"]
          id?: string
          notes?: string | null
          user_id?: string
          water_liters?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "day_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_options: {
        Row: {
          group_id: string
          id: string
          is_active: boolean
          label: string | null
          notes: string | null
          sort_order: number
        }
        Insert: {
          group_id: string
          id?: string
          is_active?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
        }
        Update: {
          group_id?: string
          id?: string
          is_active?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "food_options_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "option_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      free_entries: {
        Row: {
          created_at: string
          day_log_id: string
          description: string
          id: string
          notes: string | null
          quantity: number | null
          section_id: string | null
          unit: Database["public"]["Enums"]["food_unit"] | null
        }
        Insert: {
          created_at?: string
          day_log_id: string
          description: string
          id?: string
          notes?: string | null
          quantity?: number | null
          section_id?: string | null
          unit?: Database["public"]["Enums"]["food_unit"] | null
        }
        Update: {
          created_at?: string
          day_log_id?: string
          description?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          section_id?: string | null
          unit?: Database["public"]["Enums"]["food_unit"] | null
        }
        Relationships: [
          {
            foreignKeyName: "free_entries_day_log_id_fkey"
            columns: ["day_log_id"]
            isOneToOne: false
            referencedRelation: "day_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "free_entries_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "plan_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      global_tips: {
        Row: {
          body: string
          category: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          body: string
          category: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          body?: string
          category?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      log_entries: {
        Row: {
          created_at: string
          day_log_id: string
          id: string
          occurrence: number
          option_id: string
          servings: number
        }
        Insert: {
          created_at?: string
          day_log_id: string
          id?: string
          occurrence?: number
          option_id: string
          servings?: number
        }
        Update: {
          created_at?: string
          day_log_id?: string
          id?: string
          occurrence?: number
          option_id?: string
          servings?: number
        }
        Relationships: [
          {
            foreignKeyName: "log_entries_day_log_id_fkey"
            columns: ["day_log_id"]
            isOneToOne: false
            referencedRelation: "day_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "log_entries_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "food_options"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          abdominal_mm: number | null
          bicipital: number | null
          brazo_flexionado: number | null
          brazo_relajado: number | null
          cadera: number | null
          cintura: number | null
          created_at: string
          cresta_iliaca: number | null
          id: string
          measured_at: string
          muslo_medio_cm: number | null
          muslo_medio_mm: number | null
          notes: string | null
          pantorrilla_cm: number | null
          pantorrilla_mm: number | null
          subescapular: number | null
          supraespinal: number | null
          tricipital: number | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          abdominal_mm?: number | null
          bicipital?: number | null
          brazo_flexionado?: number | null
          brazo_relajado?: number | null
          cadera?: number | null
          cintura?: number | null
          created_at?: string
          cresta_iliaca?: number | null
          id?: string
          measured_at: string
          muslo_medio_cm?: number | null
          muslo_medio_mm?: number | null
          notes?: string | null
          pantorrilla_cm?: number | null
          pantorrilla_mm?: number | null
          subescapular?: number | null
          supraespinal?: number | null
          tricipital?: number | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          abdominal_mm?: number | null
          bicipital?: number | null
          brazo_flexionado?: number | null
          brazo_relajado?: number | null
          cadera?: number | null
          cintura?: number | null
          created_at?: string
          cresta_iliaca?: number | null
          id?: string
          measured_at?: string
          muslo_medio_cm?: number | null
          muslo_medio_mm?: number | null
          notes?: string | null
          pantorrilla_cm?: number | null
          pantorrilla_mm?: number | null
          subescapular?: number | null
          supraespinal?: number | null
          tricipital?: number | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      option_components: {
        Row: {
          description: string
          id: string
          option_id: string
          quantity: number
          sort_order: number
          unit: Database["public"]["Enums"]["food_unit"]
          weight_basis: Database["public"]["Enums"]["weight_basis"] | null
        }
        Insert: {
          description: string
          id?: string
          option_id: string
          quantity: number
          sort_order?: number
          unit: Database["public"]["Enums"]["food_unit"]
          weight_basis?: Database["public"]["Enums"]["weight_basis"] | null
        }
        Update: {
          description?: string
          id?: string
          option_id?: string
          quantity?: number
          sort_order?: number
          unit?: Database["public"]["Enums"]["food_unit"]
          weight_basis?: Database["public"]["Enums"]["weight_basis"] | null
        }
        Relationships: [
          {
            foreignKeyName: "option_components_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "food_options"
            referencedColumns: ["id"]
          },
        ]
      }
      option_groups: {
        Row: {
          id: string
          label: string
          pick_count: number
          section_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          label: string
          pick_count?: number
          section_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          label?: string
          pick_count?: number
          section_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "option_groups_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "plan_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_day_targets: {
        Row: {
          day_type: Database["public"]["Enums"]["day_type"]
          kcal_adjustment: number
          plan_id: string
          water_liters: number | null
        }
        Insert: {
          day_type: Database["public"]["Enums"]["day_type"]
          kcal_adjustment?: number
          plan_id: string
          water_liters?: number | null
        }
        Update: {
          day_type?: Database["public"]["Enums"]["day_type"]
          kcal_adjustment?: number
          plan_id?: string
          water_liters?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_day_targets_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_sections: {
        Row: {
          icon: string | null
          id: string
          label: string
          notes: string | null
          plan_id: string
          repeat_when: Database["public"]["Enums"]["day_type"][] | null
          section_type: Database["public"]["Enums"]["section_type"]
          sort_order: number
          visible_when: Database["public"]["Enums"]["day_type"][] | null
        }
        Insert: {
          icon?: string | null
          id?: string
          label: string
          notes?: string | null
          plan_id: string
          repeat_when?: Database["public"]["Enums"]["day_type"][] | null
          section_type?: Database["public"]["Enums"]["section_type"]
          sort_order?: number
          visible_when?: Database["public"]["Enums"]["day_type"][] | null
        }
        Update: {
          icon?: string | null
          id?: string
          label?: string
          notes?: string | null
          plan_id?: string
          repeat_when?: Database["public"]["Enums"]["day_type"][] | null
          section_type?: Database["public"]["Enums"]["section_type"]
          sort_order?: number
          visible_when?: Database["public"]["Enums"]["day_type"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_sections_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          base_kcal: number | null
          carbs_g: number | null
          created_at: string
          fat_g: number | null
          id: string
          is_active: boolean
          notes: string | null
          protein_g: number | null
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          base_kcal?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          is_active?: boolean
          notes?: string | null
          protein_g?: number | null
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          base_kcal?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          is_active?: boolean
          notes?: string | null
          protein_g?: number | null
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          height_cm: number | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          height_cm?: number | null
          id: string
          name: string
        }
        Update: {
          created_at?: string
          height_cm?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      day_type: "descanso" | "entreno" | "doble_entreno"
      food_unit:
        | "g"
        | "ml"
        | "taza"
        | "unidad"
        | "cda"
        | "cdta"
        | "scoop"
        | "rebanada"
        | "lata"
        | "tab"
        | "porcion"
      section_type: "comida" | "suplemento"
      weight_basis: "crudo" | "cocido"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      day_type: ["descanso", "entreno", "doble_entreno"],
      food_unit: [
        "g",
        "ml",
        "taza",
        "unidad",
        "cda",
        "cdta",
        "scoop",
        "rebanada",
        "lata",
        "tab",
        "porcion",
      ],
      section_type: ["comida", "suplemento"],
      weight_basis: ["crudo", "cocido"],
    },
  },
} as const
