import Image from "next/image";
import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-foreground font-medium ring-2 ring-background",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <Image src={src} alt={name} width={size} height={size} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function AvatarGroup({
  people,
  max = 4,
  size = 32,
}: {
  people: { name: string; avatar_url?: string }[];
  max?: number;
  size?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p, i) => (
        <Avatar key={i} src={p.avatar_url} name={p.name} size={size} />
      ))}
      {extra > 0 && (
        <span
          className="relative inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium ring-2 ring-background"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
