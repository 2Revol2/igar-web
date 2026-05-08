import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PublicCmsData } from "@/src/types";

interface ContactSectionProps {
  cms?: PublicCmsData;
}

export const ContactSection = ({ cms }: ContactSectionProps) => {
  const CONTACT_INFO = useMemo(
    () => [
      {
        label: "Напишите на почту",
        icon: "/ab-market/mail.svg",
        href: `mailto:${cms?.contact.email}`,
        value: cms?.contact.email,
      },
      {
        label: "Позвоните нам",
        icon: "/ab-market/phone.svg",
        href: `tel:${cms?.contact.phone}`,
        value: cms?.contact.phone,
      },
      {
        label: "Напишите в Telegram",
        icon: "/ab-market/telegram-white.svg",
        href: `https://t.me/${cms?.contact.phone}`,
        value: "Telegram",
      },
      {
        label: "Напишите в WhatsApp",
        icon: "/ab-market/whatsapp-white.svg",
        href: `https://wa.me/${cms?.contact.phone}`,
        value: "WhatsApp",
      },
    ],
    [cms?.contact.email, cms?.contact.phone],
  );

  return (
    <div className={"container-2025 my-20!"}>
      <div>
        <h4 className={"md:text-6xl! text-2xl! font-bold! text-black"}>Остались вопросы?</h4>
        <div className={"flex items-end gap-5 justify-between"}>
          <p className="mt-3 max-w-xl text-sm text-gray-700 sm:text-base mb-0!">
            Не нашли, что искали? Проконсультируем Вас, узнайте цену и сроки, связавшись с нами удобным способом
          </p>
          <div className={"hidden md:block flex-2 h-1 bg-logo-color rounded max-w-md"} />
        </div>
        <div className={"mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"}>
          {CONTACT_INFO.map((contact) => (
            <Link
              href={contact.href}
              key={contact.value}
              className={
                "flex items-center gap-4 border border-gray-200 p-6 bg-white! text-black!  rounded-2xl border-b-0! hover:border-logo-color hover:shadow-xl hover:shadow-logo-color/10 transition-all! duration-500! ease-out!"
              }
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-logo-color/60">
                <Image src={contact.icon} width={25} height={25} alt={contact.label} />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground! mb-0!">
                  {contact.label}
                </p>
                <p className="mt-1.5 text-base font-semibold text-foreground! transition-colors mb-0!">
                  {contact.value}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
