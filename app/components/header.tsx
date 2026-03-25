import Image from "next/image";
import Link from "next/link";
import MailIcon from "@/app/icons/mail.svg";
import LogoIcon from "@/app/icons/logo.svg";
import TelegramIcon from "@/app/icons/telegram.svg";
import PhoneIcon from "@/app/icons/phone.svg";
import WhatsAppIcon from "@/app/icons/whatsapp.svg";

const CONTACTS_LINKS = [
  { href: "mailto:abmarketbel@gmail.com", icon: MailIcon },
  { href: "tel:+375296038038", icon: PhoneIcon },
  { href: "https://wa.me/375296038038", icon: WhatsAppIcon },
  { href: "https://t.me/+375296038038", icon: TelegramIcon },
];

export const AppHeader = () => {
  return (
    <header className={"border-b border-gray-200 bg-white pt-3"}>
      <div className={"container-2025 lg:flex lg:justify-between justify-center mb-5! lg:mb-0!"}>
        <div className={"flex flex-col gap-2 items-center lg:items-start"}>
          <div className="flex items-center gap-4">
            <Image src={LogoIcon} width={150} height={150} alt="Logo" className={"lg:w-36 lg:h-36 w-28 h-28"} />
            <h1 className="font-extrabold text-black mb-0! title">ООО &#34;АБ Маркет&#34;</h1>
          </div>
          <p className="text-sm lg:max-w-lg">
            Предлагаем комплексные решения по продаже и укладке (замене) коммерческих ковровых покрытий.
          </p>
        </div>
        <div className={"flex gap-3 items-center flex-col"}>
          <div className={"flex gap-2 items-center lg:flex-row flex-col"}>
            <Link href={"tel:+375296038038"} className={"flex flex-col border-b-0! text-gray-500!"}>
              <span className={"font-bold"}>+375296038038</span>
            </Link>
            <div className="h-8 w-[1px] bg-gray-300 lg:block! hidden"></div>
            <Link href={"mailto:abmarketbel@gmail.com"} className={"flex flex-col border-b-0! text-gray-500!"}>
              <span className={"font-bold"}>abmarketbel@gmail.com</span>
            </Link>
          </div>
          <div className={"flex gap-2 lg:mr-16"}>
            {CONTACTS_LINKS.map((link, index) => (
              <Link className={"border-b-0!"} target={"_blank"} key={index} href={link.href}>
                <Image src={link.icon} alt={"Mail Icon"} width={25} height={25} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={"border-t border-gray-200 py-2"}>
        <p className={"text-xs text-center container-2025"}>
          <strong>Наши партнеры: </strong> Фабрика &#34;Нева Тафт&#34; - Крупнейший производитель ковровых покрытий в
          России, Беларуси и ЕАЭС, ООО &#34;Вельвет Про&#34;, Россия - производитель ковров и штор под заказ.
        </p>
      </div>
    </header>
  );
};
