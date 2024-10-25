/* utils.js */

//#region Polyfills
Array.prototype.forEachAsync = async function (fn) {for (let t of this) {await fn(t)} }
Array.prototype.forEachAsyncParallel = async function (fn) {await Promise.all(this.map(fn));}
Array.prototype.intersect = function (b) {return this.filter(x => b.includes(x));}
Array.prototype.union = function (b) {return [...new Set([...this, ...b])]}

Document.prototype.injectStylesheet = function (href) {
  var stylesheetLink = this.createElement('link');
  stylesheetLink.setAttribute('rel', 'stylesheet');
  stylesheetLink.setAttribute('href', href);
  this.head.appendChild(stylesheetLink);
  return stylesheetLink;
}

Document.prototype.addStyle = function (rules, id) {
  let style;
  if (id) {
    style = this.getElementById(id);
  }
  if (!style) {
    style = this.createElement('style');
    style.id = id
  }
  style.innerHTML = rules;
  this.getElementsByTagName('head')[0].appendChild(style);
  return style;
}

Document.prototype.pathnameEquals = (pathname) => document.location.pathname === pathname;
Document.prototype.pathnameMatch = (pathnameRegex) => document.location.pathname.match(pathnameRegex);
Document.prototype.pathnameStartsWith = (text) => document.location.pathname.startsWith(text);
Document.prototype.pathnameEndsWith = (text) => document.location.pathname.endsWith(text);
Document.prototype.searchParams = () => new URLSearchParams(document.location.search);

Element.prototype.$ = function (selector) {return this.querySelector(selector)};
Element.prototype.$$ = function (selector) {return [...this.querySelectorAll(selector)];};
Element.prototype.innerTextToJSON = function () {
  return this.innerText ? JSON.parse(this.innerText) : undefined;
};
HTMLElement.prototype.onClassChange = function (callback) {
  let lastClassString = this.classList.toString();
  const mutationObserver = new MutationObserver((mutationList) => {
    for (const item of mutationList) {
      if (item.attributeName === "class") {
        const classString = this.classList.toString();
        if (classString !== lastClassString) {
          callback(mutationObserver);
          lastClassString = classString;
          break;
        }
      }
    }
  });
  mutationObserver.observe(this, {attributes: true});
  return mutationObserver;
}
HTMLElement.prototype.toggleDisplay = function () {
  this.style.display = this.style.display === 'none' ? '' : 'none';
}

String.prototype.camelize = function () {
  return this.split(' ')
    .map((e, i) => i ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() : e.toLowerCase())
    .join('');
}
String.prototype.isMonth = function () {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .includes(this.valueOf());
}
String.prototype.isYear = function () {
  return (this.valueOf().length === 4)
    && Number.isInteger(Number.parseInt(this.valueOf()));
}

String.prototype.decodeHtmlEntity = function () {
  return this.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
};

String.prototype.parseUserAgent = function () {
  const [client, semver] = this.valueOf().split(':') || [undefined, undefined]
  const [version, build] = semver?.split('-') || [undefined, undefined]
  const [major, minor, patch] = version.split('.').map(el => parseInt(el)) || [undefined, undefined, undefined]
  return {
    client,
    semver,
    version,
    build,
    major,
    minor,
    patch,
  }

}

//#endregion

//#region utils

/**
 * Returns document.querySelector(selector)
 * @param {String} selector
 */
// eslint-disable-next-line no-unused-vars
const $ = (selector) => document.querySelector(selector);

/**
 * Returns [...document.querySelectorAll(selector)]
 * @param {String} selector
 */
// eslint-disable-next-line no-unused-vars
const $$ = (selector) => [...document.querySelectorAll(selector)];

/**
 * Returns [...document.querySelectorAll(selector)].find(el => el.innerText === innerText)
 * @param {String} selector
 * @param {String} innerText
 */
// eslint-disable-next-line no-unused-vars
const $$$ = (selector, innerText) => {return [...document.querySelectorAll(selector)].find(el => el.innerText === innerText)};


//#endregion

//#region Classes

// eslint-disable-next-line no-unused-vars
class Config {
  #scriptName;
  #config;
  apiUrl;
  constructor(scriptName) {
    this.#scriptName = scriptName;
    this.#loadConfig();
    if (!this.#config) this.configure()
    this.apiUrl = this.#config.apiUrl;
  }

  configure() {
    alert(`ERROR:\n${this.#scriptName} not configured`)
    const apiUrl = prompt('Enter apiUrl')
    this.#config = {
      apiUrl,
    }
    localStorage.setItem(this.#scriptName, JSON.stringify(this.#config))
  }

  #loadConfig() {
    const json = localStorage.getItem(this.#scriptName);
    this.#config = json ? JSON.parse(json) : undefined;
  }
}

/**
* @typedef StyleObject
* @type {object}
* @property {string} property
* @property {string} value
*/

/**
* @typedef LoggerOptions
* @type {object}
* @property {string} messagePrefix message prefix incluing space
* @property {StyleObject} style {'property': 'value'}}
*/

// eslint-disable-next-line no-unused-vars
class Logger {
  #preElement;
  #messagePrefix;

  /**
   * Logger
   * @param {LoggerOptions} loggerOptions
   */
  constructor(loggerOptions) {
    this.#messagePrefix = loggerOptions.messagePrefix;
    this.#preElement = document.createElement('pre');
    this.#preElement.style = [
      'display: flex;',
      'flex-direction: column-reverse;',
      'z-index: 1000;',
      'opacity: 25%;',
      'position: fixed;',
      'top: 20px;',
      'left: 20px;',
      'width: auto;',
      'max-height: calc(100vh - 40px);',
      'overflow-y: auto;',
      'scrollbar-width: none;',
    ].join('');
    loggerOptions?.style && Object.entries(loggerOptions.style).forEach((pv) => {
      const [p, v] = pv;
      this.#preElement.style[p] = v;
    })
    document.body.appendChild(this.#preElement);
  }


  #print(consoleMethod, ...data) {
    let [message, ...rest] = data;
    if (rest.length) {
      consoleMethod(`${this.#messagePrefix}`, message, ...rest);
    } else {
      consoleMethod(`${this.#messagePrefix}`, message);
    }
    if (typeof message === 'object') {
      message = JSON.stringify(message, null, 2);
    }
    this.#preElement.textContent += `${message}\n`
  }

  clear() {
    this.#preElement.textContent = '';
  }

  hide() {
    this.#preElement.style.display = this.#preElement.style.display === 'none' ? 'flex' : 'none';
  }

  info(...data) {
    this.#print(console.info, ...data);
  }

  warn(...data) {
    this.#print(console.warn, ...data);
  }

  error(...data) {
    this.#print(console.error, ...data);
  }
}

// eslint-disable-next-line no-unused-vars
class Api {
  #apiUrl;
  #logger;

  /**
   * @typedef PayloadBase
   * @type {object}
   * @property {string} userAgent - SCRIPT:VERSION
   * @property {string} source - domain.tld of source
   */

  /** @type {PayloadBase} */
  payloadBase;

  /**
   *  Create api instance
   * @param {string} apiUrl
   * @param {Logger} logger
   */
  constructor(apiUrl, logger) {
    this.#apiUrl = apiUrl;
    this.#logger = logger;
  }

  #getApiUrl(apiPath) {
    return `${this.#apiUrl}${apiPath}`
  }

  async post(apiPath, data) {
    try {
      const body = JSON.stringify(
        {
          ...this.payloadBase,
          ...data,
        }
      );
      const response = await fetch(this.#getApiUrl(apiPath), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const result = await response.json();
      return result;
    } catch (err) {
      this.#logger.error(`[POST:${apiPath}] Error:`, err);
      throw err;
    }
  }

  async get(apiPath, urlSearchParams) {
    try {
      let url = this.#getApiUrl(apiPath);
      if (urlSearchParams) {
        const search = Object.entries(urlSearchParams)
          .map((pv) => {
            let [p, v] = pv;
            return `${p}=${v}`;
          }).join('&')
        url = `${url}?${search}`;
      }
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      return result;
    } catch (err) {
      this.#logger.error(`[GET:${apiPath}] Error:`, err);
    }
  }

}

//#endregion