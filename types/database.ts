// Auto-generated TypeScript types for SubodhKC Supabase schema
// These mirror the database schema in supabase/migrations/

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          organization_kind: 'business' | 'school' | 'nonprofit' | 'individual' | 'internal' | 'other'
          status: 'active' | 'suspended' | 'archived'
          created_by: string | null
          created_at: string
          updated_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          organization_kind?: 'business' | 'school' | 'nonprofit' | 'individual' | 'internal' | 'other'
          status?: 'active' | 'suspended' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          organization_kind?: 'business' | 'school' | 'nonprofit' | 'individual' | 'internal' | 'other'
          status?: 'active' | 'suspended' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
      }
      organization_memberships: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          status: 'active' | 'invited' | 'revoked'
          joined_at: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          status?: 'active' | 'invited' | 'revoked'
          joined_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          status?: 'active' | 'invited' | 'revoked'
          joined_at?: string
          created_at?: string
        }
      }
      organization_invitations: {
        Row: {
          id: string
          organization_id: string
          email: string
          role: 'owner' | 'admin' | 'member'
          token_hash: string
          invited_by: string | null
          expires_at: string
          accepted_at: string | null
          revoked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          role?: 'owner' | 'admin' | 'member'
          token_hash: string
          invited_by?: string | null
          expires_at: string
          accepted_at?: string | null
          revoked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          role?: 'owner' | 'admin' | 'member'
          token_hash?: string
          invited_by?: string | null
          expires_at?: string
          accepted_at?: string | null
          revoked_at?: string | null
          created_at?: string
        }
      }
      platform_user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'platform_admin' | 'support'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'platform_admin' | 'support'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'platform_admin' | 'support'
          created_at?: string
        }
      }
      offerings: {
        Row: {
          id: string
          offering_key: string
          name: string
          description: string | null
          offering_kind: 'product' | 'tool' | 'service' | 'program' | 'external_product'
          status: 'active' | 'deprecated' | 'planned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          offering_key: string
          name: string
          description?: string | null
          offering_kind?: 'product' | 'tool' | 'service' | 'program' | 'external_product'
          status?: 'active' | 'deprecated' | 'planned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          offering_key?: string
          name?: string
          description?: string | null
          offering_kind?: 'product' | 'tool' | 'service' | 'program' | 'external_product'
          status?: 'active' | 'deprecated' | 'planned'
          created_at?: string
          updated_at?: string
        }
      }
      organization_entitlements: {
        Row: {
          id: string
          organization_id: string
          offering_id: string
          status: 'active' | 'suspended' | 'expired' | 'revoked' | 'pending'
          source_type: 'manual' | 'engagement' | 'subscription' | 'trial' | 'program' | 'migration'
          source_reference: string | null
          valid_from: string
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          offering_id: string
          status?: 'active' | 'suspended' | 'expired' | 'revoked' | 'pending'
          source_type?: 'manual' | 'engagement' | 'subscription' | 'trial' | 'program' | 'migration'
          source_reference?: string | null
          valid_from?: string
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          offering_id?: string
          status?: 'active' | 'suspended' | 'expired' | 'revoked' | 'pending'
          source_type?: 'manual' | 'engagement' | 'subscription' | 'trial' | 'program' | 'migration'
          source_reference?: string | null
          valid_from?: string
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      member_offering_roles: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          offering_id: string
          role: 'admin' | 'user' | 'viewer'
          status: 'active' | 'revoked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          offering_id: string
          role?: 'admin' | 'user' | 'viewer'
          status?: 'active' | 'revoked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          offering_id?: string
          role?: 'admin' | 'user' | 'viewer'
          status?: 'active' | 'revoked'
          created_at?: string
          updated_at?: string
        }
      }
      engagements: {
        Row: {
          id: string
          organization_id: string
          engagement_type: 'project' | 'retainer' | 'fractional' | 'pilot' | 'program' | 'pro_bono'
          status: 'planned' | 'active' | 'completed' | 'cancelled' | 'on_hold'
          starts_at: string | null
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          engagement_type: 'project' | 'retainer' | 'fractional' | 'pilot' | 'program' | 'pro_bono'
          status?: 'planned' | 'active' | 'completed' | 'cancelled' | 'on_hold'
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          engagement_type?: 'project' | 'retainer' | 'fractional' | 'pilot' | 'program' | 'pro_bono'
          status?: 'planned' | 'active' | 'completed' | 'cancelled' | 'on_hold'
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      engagement_offerings: {
        Row: {
          id: string
          engagement_id: string
          offering_id: string
          created_at: string
        }
        Insert: {
          id?: string
          engagement_id: string
          offering_id: string
          created_at?: string
        }
        Update: {
          id?: string
          engagement_id?: string
          offering_id?: string
          created_at?: string
        }
      }
      external_system_links: {
        Row: {
          id: string
          organization_id: string
          system_key: string
          external_object_type: string
          external_id: string
          status: 'active' | 'inactive' | 'error'
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          system_key: string
          external_object_type?: string
          external_id: string
          status?: 'active' | 'inactive' | 'error'
          metadata?: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          system_key?: string
          external_object_type?: string
          external_id?: string
          status?: 'active' | 'inactive' | 'error'
          metadata?: Record<string, unknown>
          created_at?: string
        }
      }
      audit_events: {
        Row: {
          id: number
          organization_id: string | null
          actor_user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: {
          organization_id?: string | null
          actor_user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
        }
        Update: never
      }
      site_analytics_events: {
        Row: {
          id: number
          event_type: 'pageview' | 'engagement' | 'click' | 'form_submit' | 'form_error' | 'conversion'
          path: string
          referrer: string | null
          user_agent: string | null
          ip_hash: string | null
          session_id: string | null
          duration: number
          meta: Record<string, unknown>
          created_at: string
        }
        Insert: {
          event_type: 'pageview' | 'engagement' | 'click' | 'form_submit' | 'form_error' | 'conversion'
          path: string
          referrer?: string | null
          user_agent?: string | null
          ip_hash?: string | null
          session_id?: string | null
          duration?: number
          meta?: Record<string, unknown>
          created_at?: string
        }
        Update: never
      }
      outreach_emails: {
        Row: {
          id: number
          slug: string
          article_title: string
          target: string
          recipient_email: string | null
          subject: string
          body_preview: string | null
          email_type: 'initial' | 'follow_up' | 'reply'
          status: 'sent' | 'replied' | 'followed_up' | 'closed'
          sent_date: string
          replied_date: string | null
          followed_up_date: string | null
          closed_date: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          slug: string
          article_title: string
          target: string
          recipient_email?: string | null
          subject: string
          body_preview?: string | null
          email_type?: 'initial' | 'follow_up' | 'reply'
          status?: 'sent' | 'replied' | 'followed_up' | 'closed'
          sent_date?: string
          replied_date?: string | null
          followed_up_date?: string | null
          closed_date?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          slug?: string
          article_title?: string
          target?: string
          recipient_email?: string | null
          subject?: string
          body_preview?: string | null
          email_type?: 'initial' | 'follow_up' | 'reply'
          status?: 'sent' | 'replied' | 'followed_up' | 'closed'
          sent_date?: string
          replied_date?: string | null
          followed_up_date?: string | null
          closed_date?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          source: 'site' | 'magazine' | 'lead_magnet' | 'webinar' | 'course'
          status: 'active' | 'unsubscribed' | 'bounced'
          metadata: Record<string, unknown>
          subscribed_at: string
          unsubscribed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: 'site' | 'magazine' | 'lead_magnet' | 'webinar' | 'course'
          status?: 'active' | 'unsubscribed' | 'bounced'
          metadata?: Record<string, unknown>
          subscribed_at?: string
          unsubscribed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: 'site' | 'magazine' | 'lead_magnet' | 'webinar' | 'course'
          status?: 'active' | 'unsubscribed' | 'bounced'
          metadata?: Record<string, unknown>
          subscribed_at?: string
          unsubscribed_at?: string | null
          created_at?: string
        }
      }
      lead_magnet_downloads: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          resource: string
          source_page: string | null
          downloaded_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          resource: string
          source_page?: string | null
          downloaded_at?: string
        }
        Update: never
      }
      webinar_registrations: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          webinar_slug: string
          registered_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          webinar_slug: string
          registered_at?: string
        }
        Update: never
      }
      course_enrollments: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          course_slug: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          course_slug: string
          enrolled_at?: string
        }
        Update: never
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          message: string
          source_page: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          message: string
          source_page?: string | null
          submitted_at?: string
        }
        Update: never
      }
    }
    Functions: {
      handle_new_user: () => void
      update_updated_at: () => void
    }
  }
  private: {
    Functions: {
      is_platform_admin: () => boolean
      is_org_member: (org_id: string) => boolean
      has_org_role: (org_id: string, roles: string[]) => boolean
      has_offering_access: (org_id: string, offering_key: string) => boolean
      has_offering_role: (org_id: string, offering_key: string, roles: string[]) => boolean
    }
  }
}
