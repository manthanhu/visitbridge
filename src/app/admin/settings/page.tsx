import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PageHeader } from "@/components/admin/page-header";
import { Settings, Shield, Bell, Palette, Globe } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const settingsSections = [
    {
      icon: Shield,
      title: "Account",
      description: "Your administrator account details",
      items: [
        { label: "Name", value: user?.name || "—" },
        { label: "Email", value: user?.email || "—" },
        { label: "Role", value: "Administrator" },
      ],
    },
    {
      icon: Globe,
      title: "Platform",
      description: "General platform configuration",
      items: [
        { label: "Platform", value: "VisitBridge" },
        { label: "Version", value: "0.1.0" },
        { label: "Environment", value: process.env.NODE_ENV || "development" },
      ],
    },
  ];

  const upcomingSettings = [
    { icon: Bell, label: "Notifications", description: "Configure email and push notification preferences" },
    { icon: Palette, label: "Appearance", description: "Customize the admin panel theme and layout" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and platform configuration"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <section.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{section.title}</h3>
                <p className="text-[11px] text-zinc-600">{section.description}</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-xs font-medium text-zinc-500">{item.label}</span>
                  <span className="text-sm text-zinc-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Coming Soon
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingSettings.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-white/[0.04] border-dashed bg-white/[0.01] p-4 opacity-60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-500/10 text-zinc-500">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{item.label}</p>
                <p className="text-[11px] text-zinc-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
