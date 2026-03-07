import { Users } from 'lucide-react'

type OrgCardProps = {
  name: string
  role: string
  memberCount: number
  logo: string | null
  isPending: boolean
  onClick: () => void
}

export function OrgCard({
  name,
  role,
  memberCount,
  logo,
  isPending,
  onClick,
}: OrgCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={`group relative h-48 w-full overflow-hidden rounded-xl text-left transition-all ${
        isPending
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:shadow-2xl'
      }`}
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-400">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
        </div>
      )}

      <div className="absolute -bottom-1 left-0 right-0 h-[calc(100%+0.25rem)] translate-y-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-transform duration-300 group-hover:-translate-y-1" />

      <div className="absolute bottom-0 left-0 right-0 translate-y-0 p-4 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-sm text-white/80 capitalize">{role}</span>
          <span className="text-white/40">·</span>
          <span className="flex items-center gap-1 text-sm text-white/80">
            <Users className="h-3.5 w-3.5" />
            {memberCount}
          </span>
        </div>
      </div>
    </button>
  )
}
