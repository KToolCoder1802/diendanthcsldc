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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          hidden: boolean
          id: string
          parent_id: string | null
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          hidden?: boolean
          id?: string
          parent_id?: string | null
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          hidden?: boolean
          id?: string
          parent_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          attachments: Json
          author_id: string
          content: string
          created_at: string
          hidden: boolean
          id: string
          pinned: boolean
          section: Database["public"]["Enums"]["post_section"]
          tag_class: string | null
          tag_subject: string | null
          updated_at: string
        }
        Insert: {
          attachments?: Json
          author_id: string
          content?: string
          created_at?: string
          hidden?: boolean
          id?: string
          pinned?: boolean
          section?: Database["public"]["Enums"]["post_section"]
          tag_class?: string | null
          tag_subject?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: Json
          author_id?: string
          content?: string
          created_at?: string
          hidden?: boolean
          id?: string
          pinned?: boolean
          section?: Database["public"]["Enums"]["post_section"]
          tag_class?: string | null
          tag_subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_info: {
        Row: {
          email: string | null
          user_id: string
          zalo: string | null
        }
        Insert: {
          email?: string | null
          user_id: string
          zalo?: string | null
        }
        Update: {
          email?: string | null
          user_id?: string
          zalo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "private_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          class_name: string | null
          created_at: string
          full_name: string
          id: string
          is_teacher: boolean
          locked: boolean
          subject: string | null
          tick: Database["public"]["Enums"]["tick_color"] | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          class_name?: string | null
          created_at?: string
          full_name: string
          id: string
          is_teacher?: boolean
          locked?: boolean
          subject?: string | null
          tick?: Database["public"]["Enums"]["tick_color"] | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          class_name?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_teacher?: boolean
          locked?: boolean
          subject?: string | null
          tick?: Database["public"]["Enums"]["tick_color"] | null
          username?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          post_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reporter_id: string
          resolved: boolean
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason: string
          reporter_id: string
          resolved?: boolean
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string
          resolved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tick_requests: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          position: Database["public"]["Enums"]["teacher_position"]
          reason: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          subject: string | null
          user_id: string
          username: string
          zalo: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          position: Database["public"]["Enums"]["teacher_position"]
          reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject?: string | null
          user_id: string
          username: string
          zalo: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          position?: Database["public"]["Enums"]["teacher_position"]
          reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          subject?: string | null
          user_id?: string
          username?: string
          zalo?: string
        }
        Relationships: [
          {
            foreignKeyName: "tick_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_set_locked: {
        Args: { _locked: boolean; _uid: string }
        Returns: undefined
      }
      admin_set_tick: {
        Args: {
          _subject: string
          _tick: Database["public"]["Enums"]["tick_color"]
          _uid: string
        }
        Returns: undefined
      }
      can_post: {
        Args: {
          _section: Database["public"]["Enums"]["post_section"]
          _uid: string
        }
        Returns: boolean
      }
      censor: { Args: { _t: string }; Returns: string }
      complete_signup: {
        Args: {
          _class_name: string
          _email: string
          _full_name: string
          _kind: string
          _position: Database["public"]["Enums"]["teacher_position"]
          _subject: string
          _zalo: string
        }
        Returns: undefined
      }
      get_tick: {
        Args: { _uid: string }
        Returns: Database["public"]["Enums"]["tick_color"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _uid: string }; Returns: boolean }
      notify: {
        Args: { _link: string; _msg: string; _uid: string }
        Returns: undefined
      }
      resubmit_tick_request: {
        Args: {
          _position: Database["public"]["Enums"]["teacher_position"]
          _subject: string
          _zalo: string
        }
        Returns: undefined
      }
      review_tick_request: {
        Args: { _approve: boolean; _id: string; _reason: string }
        Returns: undefined
      }
      username_available: { Args: { _username: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      post_section: "home" | "announce" | "teachers" | "update"
      request_status: "pending" | "approved" | "rejected"
      teacher_position: "principal" | "tpt" | "subject"
      tick_color: "blue" | "gold" | "pink" | "red"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
      post_section: ["home", "announce", "teachers", "update"],
      request_status: ["pending", "approved", "rejected"],
      teacher_position: ["principal", "tpt", "subject"],
      tick_color: ["blue", "gold", "pink", "red"],
    },
  },
} as const
