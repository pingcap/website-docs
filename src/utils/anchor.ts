import { navigate, withPrefix } from "gatsby";

/**
 * Generate a array with the real and internal href, which is usually used for non-js/js routing.
 *
 * @export
 * @param {string} href
 * @param {string} lang
 * @param {string} doc
 * @param {string} version
 * @return {[string, string, string]}
 */
export function generateHrefs(
  href: string,
  lang: string,
  doc: string,
  version: string
) {
  const hrefArray = href.split("/");
  const name = hrefArray[hrefArray.length - 1].replace(".md", "");
  const result = [lang === "en" ? "" : "/" + lang, doc, version, name].join(
    "/"
  );

  return [withPrefix(result), result, name];
}

/**
 * If the user clicks on the link with the left click, then use internal router to navigate.
 *
 * @export
 * @param {KeyboardEvent} e
 * @return {boolean}
 */
export function navigateInsideEventListener(e: any) {
  const dataHref = e.target?.getAttribute("data-href");

  if (
    dataHref &&
    // ref: https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-link/src/index.js
    e.button === 0 && // ignore right clicks
    !e.defaultPrevented && // onClick prevented default
    !e.metaKey && // ignore clicks with modifier keys...
    !e.altKey &&
    !e.ctrlKey &&
    !e.shiftKey
  ) {
    e.preventDefault();

    navigate(dataHref);

    return true;
  }

  return false;
}

const reAnchor = /[^-\w\u4E00-\u9FFF]*/g; // with CJKLanguage
export const sliceVersionMark = /span-classversion-mark|span$/g;

export default function replaceInternalHref(
  lang: string,
  doc: string,
  version: string,
  simpletab = false
) {
  const aTags = document.querySelectorAll(
    `${simpletab ? ".PingCAP-simpleTab" : ".doc-content"} a`
  );
  const docTocATags = document.querySelectorAll(`.doc-toc a`);

  Array.from(aTags).forEach((a: any) => {
    let href = a.getAttribute("href");

    if (href && !href.startsWith("http") && href.includes(".md")) {
      const [realHref, internalHref] = generateHrefs(href, lang, doc, version);

      a.href = realHref;
      a.setAttribute("data-href", internalHref);
      a.addEventListener("click", navigateInsideEventListener);
    }

    if (a.classList.contains("anchor")) {
      a.href =
        "#" +
        decodeURIComponent(href)
          .replace(reAnchor, "")
          .replace(sliceVersionMark, "");
      a.parentElement.id = a.parentElement.id
        .replace(reAnchor, "")
        .replace(sliceVersionMark, "");
    }
  });

  // Replace anchor str in doc toc
  Array.from(docTocATags).forEach((a: any) => {
    let href = a.getAttribute("href");
    a.href =
      "#" +
      decodeURIComponent(href)
        .replace(reAnchor, "")
        .replace(sliceVersionMark, "");
    a.parentElement.id = a.parentElement.id
      .replace(reAnchor, "")
      .replace(sliceVersionMark, "");
  });

  if (!simpletab && window.location.hash) {
    window.location.href = window.location.hash;
  }
}
