import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: number
  showText?: boolean
  linkTo?: string
}

export function Logo({ size = 32, showText = true, linkTo = "/" }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.svg"
        alt="DataLens"
        width={size}
        height={size}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          DataLens
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex items-center no-underline">
        {content}
      </Link>
    )
  }

  return content
}