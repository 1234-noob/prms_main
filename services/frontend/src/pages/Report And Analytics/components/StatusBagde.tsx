interface StatusBadgeProps {
  status: string
}

const statusColors: Record<string, string> = {
  
  rented: "bg-green-100 text-green-800",
  available: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        statusColors[status.toLowerCase()] ?? statusColors.default
      }`}
    >
      {status}
    </span>
  )
}
