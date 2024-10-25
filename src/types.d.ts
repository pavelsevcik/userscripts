interface Array<T> {
  forEachAsync: (fn: Function) => void;
  forEachAsyncParallel: (fn: Function) => void;
}

interface Document {
  /**
   * Add style rules to styleId, add style element to head if styleId not exists
   * @param rules css rules
   * @param id id of style element
   * @returns
   */
  addStyle: (rules: String, id?: string) => void;

  /**
   * Append link stylesheet to document head
   * @param href url of css file
   * @returns html link element
   */
  injectStylesheet: (href: string) => HTMLLinkElement;

  pathnameEquals: (pathname: String) => Boolean;
  pathnameMatch: (pathnameRegex: String) => Boolean;
  pathnameStartsWith: (text: String) => Boolean;
  pathnameEndsWith: (text: String) => Boolean;
  searchParams: () => URLSearchParams;
}

interface Element {
  $: (selector: string) => Element;
  $$: (selector: string) => Element[];
  innerTextToJSON: () => Object;
}

interface HTMLElement {
  onClassChange: (callback: MutationCallback) => MutationObserver;
  styleOpacity: (opacity: Number) => void;
}

type UserAgentObject = {
  client: string;
  semver: string;
  version: string;
  build: string;
  major: number;
  minor: number;
  patch: number;
};

interface String {
  camelize(): string;
  decodeHtmlEntity(): string;
  isMonth(): boolean;
  isYear(): boolean;
  parseUserAgent(): UserAgentObject;
}
