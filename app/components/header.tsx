import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

interface AppHeaderProps {
  headerNavbar: string;
}

export const AppHeader = ({ headerNavbar }: AppHeaderProps) => {
  const clean = DOMPurify.sanitize(headerNavbar);

  return (
    <header className={"bg-white sticky top-0 left-0 z-50"}>
      {/* top section with logo */}
      <div className={"py-4 border-b border-gray-200"}>
        <div className={"container-2025 flex justify-between"}>
          <div className={"flex gap-5 items-center"}>
            <div className="header__menu-open" aria-label="Открыть меню"></div>

            <Image src={"/logo.svg"} alt={"logo"} width={125} height={48} />
            <div className="sm:flex items-center gap-1 text-xs">
              <Image src={"/geo.svg"} alt={"Geo"} width={15} height={15} />
              Беларусь
            </div>
          </div>
          <div className={"flex gap-2 items-center"}>
            <Link
              className={"hover:text-gray-800! border-r pr-4  border-b-0! border-[#e1e1e1] flex flex-col "}
              href="tel:+375296038038"
            >
              <span className={"text-gray-600 font-bold text-sm"}>+375 29 603-80-38</span>
              <span className={"text-xs leading-none text-gray-600"}>Обратный звонок</span>
            </Link>

            <Link className={"hover:text-gray-800! border-b-0! flex flex-col "} href="tel:+375296038038">
              <span className={"text-gray-600 font-bold text-sm"}>abmarketbel@gmail.com</span>
              <span className={"text-xs leading-none text-gray-600"}>Работаем в будни с 10:00 до 17:00</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={"py-2 bg-[#f8f9fa] border-b border-gray-200"}>
        <div className={"container-2025 text-xs flex wrap flex-col"}>
          <span>
            ООО &#34;АБ Маркет&#34; является официальным представителем фабрики &#34;Нева Тафт&#34; -&nbsp; крупнейшего
            производителя ковровых покрытий в ЕАЭС,
          </span>
          <span>
            а также представителем ООО &#34;Вельвет Про&#34; - ведущего производителя ковров и штор под заказ в
            Российской Федерации.
          </span>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: clean }} />
    </header>
  );
};
