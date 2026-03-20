export const applyGoogleFonts = (document: Document) => {
  document.querySelectorAll('link[href*="/fonts/"]').forEach((el) => el.remove());

  // Bitrix
  document.querySelectorAll("style").forEach((style) => {
    if (style.textContent.includes("/fonts/")) {
      style.remove();
    }
  });

  const link1 = document.createElement("link");
  link1.rel = "preconnect";
  link1.href = "https://fonts.googleapis.com";
  document.head.appendChild(link1);

  const link2 = document.createElement("link");
  link2.rel = "preconnect";
  link2.href = "https://fonts.gstatic.com";
  link2.crossOrigin = "anonymous";
  document.head.appendChild(link2);

  const link3 = document.createElement("link");
  link3.rel = "stylesheet";
  link3.href =
    "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap";
  document.head.appendChild(link3);
};
