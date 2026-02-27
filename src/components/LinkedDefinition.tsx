import Link from "next/link";
import { parseDefinition } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
};

export function LinkedDefinition({ text, className = "" }: Props) {
  const segments = parseDefinition(text);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.type === "link" ? (
          <Link key={i} href={seg.href} className="def-link">
            {seg.display}
          </Link>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </span>
  );
}
