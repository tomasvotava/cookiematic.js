/**
 * @typedef {Object} CookieConfig
 * @property {Boolean} analytics
 * @property {Boolean} marketing
 */

/**
 * Get cookie value by cookie name
 * @param {String} cookiename cookie name to return the value of
 * @returns {String}
 */
function getCookie(cookiename) {
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

/**
 * Set cookie value
 * @param {String} name Cookie name to set value of
 * @param {String} value value for a new cookie
 * @param {Number} expDays number of days for expiration date (default: 30)
 */
function setCookie(name, value, expDays) {
  const exp = new Date();
  exp.setDate(exp.getDate() + expDays || 30);
  const expires = exp.toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

/**
 * @typedef {Object} CookieMaticOptionsStrings
 * @property {String}
 */

/**
 * @typedef {Object} CookieMaticOptions
 * @property {String} accentColor
 */

class CookieMatic {
  /**
   *
   * @param {CookieMaticOptions} options
   */
  constructor(options) {
    this.options = options || {};
  }

  getFormFieldConfig(formFieldType) {
    const el = document.getElementById(`cookiematic--select-${formFieldType}`);
    if (!el) return false;
    return !!el.checked;
  }

  /**
   * @returns {CookieConfig}
   */
  readForm() {
    return {
      analytics: this.getFormFieldConfig("analytics"),
      marketing: this.getFormFieldConfig("marketing"),
    };
  }

  savePreferencesForm() {
    const prefs = this.readForm();
    this.savePreferences(prefs);
  }

  /**
   *
   * @param {CookieConfig} param0
   */
  savePreferences({ analytics, marketing }) {
    if (analytics) setCookie("consent_analytics", "1", 30);
    else setCookie("consent_analytics", "", 0);
    if (marketing) setCookie("consent_marketing", "1", 30);
    else setCookie("consent_marketing", "", 0);
  }

  /**
   * @returns {Boolean}
   */
  get analyticsConsented() {
    return !!getCookie("consent_analytics");
  }

  /**
   * @returns {Boolean}
   */
  get marketingConsented() {
    return !!getCookie("consent_marketing");
  }

  /**
   * @returns {String}
   */
  get html() {
    return `<div class="cookiematic--drop">
    <div class="cookiematic--banner">
      <h1>Nastavení cookies</h1>
      <div>
        <h2>Funkční cookies</h2>
        <label for="cookiematic--select-necessary">
          <p>
            Tyto cookies jsou povoleny automaticky, protože jsou nezbytné pro
            základní funkce stránky
          </p>
          <span class="cookiematic--select disabled">
            <input
              checked
              disabled
              type="checkbox"
              name="cookiematic--select-necessary"
              id="cookiematic--select-necessary" /><span
              class="cookiematic--checkbox"
            ></span></span
        ></label>
        <h2>Analytické cookies</h2>
        <label for="cookiematic--select-analytics">
          <p>
            Díky tomuto druhu cookies můžeme měřit anonymizované návštěvy webu či
            analyzovat, jak jsou stránky používány, což nám umožňuje zlepšovat
            jejich funkčnost.
          </p>
          <span class="cookiematic--select">
            <input
              ${this.analyticsConsented ? "checked" : ""}
              type="checkbox"
              name="cookiematic--select-analytics"
              id="cookiematic--select-analytics" /><span
              class="cookiematic--checkbox"
            ></span></span
        ></label>
        <h2>Marketingové cookies</h2>
        <label for="cookiematic--select-marketing">
          <p>
            Marketingové cookies pomáhají nám a našim partnerům s lepším cílením
            reklam. Tyto cookies také pracují s anonymizovanými daty.
          </p>
          <span class="cookiematic--select">
            <input
              ${this.marketingConsented ? "checked" : ""}
              type="checkbox"
              name="cookiematic--select-marketing"
              id="cookiematic--select-marketing" /><span
              class="cookiematic--checkbox"
            ></span></span
        ></label>
        <div class="cookiematic--controls">
          <button
            class="cookiematic--button cookiematic--accept-all"
            style="background-color: ${this.options.accentColor || "#18ad71d0"}"
            type="button"
          >
            Přijmout vše
          </button>
          <button
            class="cookiematic--button cookiematic--accept-form"
            type="button"
          >
            Uložit nastavení
          </button>
          <button
            class="cookiematic--button cookiematic--accept-none"
            type="button"
          >
            Odmítnout volitelná cookies
          </button>
        </div>
      </div>
    </div>
  </div>
  <a href="#" class="cookiematic--float">Cookies&nbsp;&#x2699;</a>
  `;
  }

  /**
   * create cookie banner elements in a container
   * @param {Element} container element to replace
   */
  create(container) {
    container.innerHTML = this.html;
    document.querySelector(`.cookiematic--accept-all`).onclick = () => {
      this.savePreferences({ marketing: true, analytics: true });
    };
    document.querySelector(`.cookiematic--accept-none`).onclick = () => {
      this.savePreferences({ marketing: false, analytics: false });
    };
    document.querySelector(`.cookiematic--accept-form`).onclick = () => {
      this.savePreferencesForm();
    };
  }
}
