'use client';
import React from 'react';
import {
  User,
  Palette,
  Bell,
  Lock,
  Database,
  Code,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import AccountSettings from '@/components/settings/account-settings';
import AppearanceSettings from '@/components/settings/appearance-settings';
import NotificationsSettings from '@/components/settings/notifications-settings';
import APISettings from '@/components/settings/api-settings';
import SecuritySettings from '@/components/settings/security-settings';
import DataPrivacySettings from '@/components/settings/data-privacy-settings';
import BillingSettings from '@/components/settings/billing-settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const settingsSections = [
  { id: 'account', label: 'Account', icon: User, component: AccountSettings },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    component: AppearanceSettings,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    component: NotificationsSettings,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    component: SecuritySettings,
  },
  {
    id: 'data-privacy',
    label: 'Data & Privacy',
    icon: Database,
    component: DataPrivacySettings,
  },
  { id: 'api', label: 'API', icon: Code, component: APISettings },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    component: BillingSettings,
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('account');
  const ActiveComponent =
    settingsSections.find((s) => s.id === activeSection)?.component ||
    AccountSettings;
  const isMobile = useIsMobile();

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>
        <Select value={activeSection} onValueChange={setActiveSection}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a setting" />
          </SelectTrigger>
          <SelectContent>
            {settingsSections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">
          <ActiveComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
        <nav className="flex flex-col gap-1 sticky top-20">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground',
                activeSection === section.id && 'bg-muted text-foreground'
              )}
            >
              <section.icon className="h-5 w-5" />
              <span className="flex-1 text-left">{section.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </nav>
        <div>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
