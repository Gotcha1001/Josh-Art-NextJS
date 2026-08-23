import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  { href: "/references", label: "References" },
  { href: "/business-details", label: "Business Details" },
  { href: "/data-protection", label: "Data Protection" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://stoneartcity.blogspot.com/?m=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Stone Art City Blog
            </a>
          </li>
        </ul>
        <Image
          src="https://raw.githubusercontent.com/Gotcha1001/My-Images-for-sites-Wes/main/JoshLogo.JPG"
          alt="Josh's Art Logo"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
    </footer>
  );
}
