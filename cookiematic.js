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
 * @param {String} site site url to be displayed in privacy policy text
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
 * @property {String} accentText
 * @property {Boolean} reload
 */

class CookieMatic {
  /**
   *
   * @param {CookieMaticOptions} options
   */
  constructor(options) {
    this.options = options || {};
    this.container = null;
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
    setCookie("consent_given", "1", 90);
    if (analytics) setCookie("consent_analytics", "1", 30);
    else setCookie("consent_analytics", "", 0);
    if (marketing) setCookie("consent_marketing", "1", 30);
    else setCookie("consent_marketing", "", 0);

    this.hideSettings();
    if (this.options.reload) {
      window.location.reload();
    }
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
    return `<div class="cookiematic--drop cookiematic--drop-settings">
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
        <p style="text-align: center; border-top: 1px solid #979797; margin-top: 1em;">Pokud chcete získat více informací, přečtěte si naše <a href="#" class="cookiematic--open-policy">Zásady ochrany osobních údajů a používání souborů cookie</a>.
        </p>
        <div class="cookiematic--controls">
          <button
            class="cookiematic--button cookiematic--accept-all"
            style="background-color: ${
              this.options.accentColor || "#18ad71d0"
            }; color: ${this.options.accentText || "black"}"
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
   * @returns {String}
   */
  get policyHtml() {
    return `<div class="cookiematic--drop cookiematic--drop-policy">
    <button class="cookiematic--close" type="button">&times;</button><div class="cookiematic--policy">
    <div class="cookiematic--container">
    <h1>Zásady zpracování osobních údajů ${
      this.options.site || window.location.host
    }</h1>
    <p>
    Všichni v naší firmě považujeme osobní údaje za velmi cenné
    informace a podle toho s nimi také nakládáme. Prosíme přečtěte
    si, jak k ochraně osobních údajů přistupujeme. Pokud byste s
    jakýmkoliv bodem nesouhlasili nebo měli jakékoliv dotazy,
    kontaktujte nás.
  </p>

  <h2>Správce osobních údajů</h2>

  <p>Správcem osobních údajů je:</p>

  <p style="text-align: center;">
    Stock Plzeň - Božkov s.r.o.<br />Palírenská 641/2<br />326 00,
    Plzeň - Božkov
  </p>

  <p style="text-align: center;">
    Tel.: +420 378 081 111<br />Fax: +420 378 081 499<br />E-mail:
    <a href="mailto:info@bozkov.cz">info@bozkov.cz</a>
  </p>

  <p style="text-align: center;">IČO: 27904636<br />DIČ: CZ27904636</p>

  <p style="text-align: center;">
    Zapsána v OR vedeném Kraj. Soudem v Plzni, oddíl C, vložka 21004
  </p>

  <h2>Účely zpracování</h2>

  <p>Vaše osobní údaje zpracováváme pro následující účely:</p>

  <ol>
    <li>
      Marketingové účely spočívající v&nbsp;individualizovaně cílené
      reklamě (prostřednictvím cookies)
    </li>
    <li>
      Datum narození poskytnuté při navštívení webové stránky je
      vyžadováno z&nbsp;důvodu ochrany zdraví nezletilých před
      vlivem návykových látek, přičemž nezletilým není dále vstup
      povolen. Následně se do cookies spolu s&nbsp;IP adresou ukládá
      pouze informace, zda jste starší 18 let.
    </li>
    <li>
      V&nbsp;případě, že jste se na webové stránky ${
        this.options.site || window.location.host
      }
      přihlásili prostřednictvím Facebook, pro účely přihlášení jsou
      zpracovány Vaše osobní údaje (jméno, příjmení, e-mailová
      adresa, věková hranice). Přihlašovací údaje jsou uloženy ve
      formě autentikačního tokenu Facebook.
    </li>
    <li>
      Bezchybné fungování našich webových stránek
      <a href="https://www.${this.options.site || window.location.host}/">www.${
      this.options.site || window.location.host
    }</a> (tzv.
      funkční cookies)
    </li>
  </ol>

  <h2>Právní základ pro zpracování</h2>

  <p>
    Právním základem pro zpracování pro marketingové účely je
    souhlas, který jste nám udělili při první návštěvě našich
    webových stránek www.${
      this.options.site || window.location.host
    }. Poskytování osobních údajů je
    smluvním požadavkem. Zpracování Vašich osobních údajů pro
    marketingové účely prostřednictvím cookies není nezbytné pro
    vstup a prohlížení našich webových stránek a souhlas
    k&nbsp;tomuto účelu může být kdykoliv odvolán.
  </p>

  <p>
    Datum narození a Vaše věková hranice jsou naopak zpracovávány na
    základě zákonného požadavku (§ 15 zákona č. 65/2017 Sb., o
    ochraně zdraví před škodlivými účinky návykových látek,
    v&nbsp;platném znění), a proto je zpracování pro účely zjištění
    vašeho věku nutností. Datum narození se nikde dále neuchovává a
    slouží pouze k&nbsp;ověření věku pro vstup na webové
    stránky&nbsp;<a href="http://www.${
      this.options.site || window.location.host
    }/">www.${this.options.site || window.location.host}</a>.
  </p>

  <p>
    V&nbsp;případě, že zvolíte přihlášení přes Facebook, poskytujete
    na základě smluvního požadavku též své jméno, příjmení a
    e-mailovou adresu. Právním základem je Váš souhlas. Pokud nebude
    Váš souhlas dán, nelze zvolit přihlášení přes Facebook.
  </p>

  <p>
    Vaše osobní údaje v&nbsp;rozsahu IP adresa, věkové hranice jsou
    zpracovány do podoby tzv. funkčních cookies, a to na základě
    oprávněného zájmu správce, kterým je řádné fungování webových
    stránek.
  </p>

  <h2>Rozsah zpracovávaných údajů</h2>

  <p>
    Zpracováváme jen nezbytně nutné údaje, abychom Vám mohli
    nabídnout kvalitní obsah na míru.
  </p>

  <ul>
    <li>Historie navštívených stránek (IP adresa, cookies)</li>
    <li>
      Přihlášení přes Facebook (jméno, příjmení, e-mailová adresa,
      věková hranice) uložených správcem ve formě autentikačního
      tokenu
    </li>
    <li>
      Navštívení webu
      <a href="https://www.${this.options.site || window.location.host}/">www.${
      this.options.site || window.location.host
    }</a> (datum
      narození)
    </li>
  </ul>

  <h2>Příjemci osobních údajů</h2>

  <p>
    Vaše osobní údaje chráníme jako oko v hlavě a&nbsp;<strong
      >nikomu třetímu je neprodáme!</strong
    >&nbsp;Abychom Vám mohli nabízet ten nejlepší obsah přesně na
    míru, tak používáme kvalitní nástroje třetích stran. Tyto
    nástroje některé Vaše osobní údaje zpracovávají - ale výhradně
    za účelem cíleného oslovení nebo pro zlepšení kvality našich
    služeb. Jejich výčet je v tabulce níže.
  </p>

  <figure class="wp-block-table">
    <table class="">
      <thead>
        <tr>
          <td>Název</td>
          <td>Země</td>
          <td>Účel zpracování</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            <a
              target="_blank"
              href="https://www.google.com/analytics/"
              rel="noreferrer noopener"
              >Google Analytics</a
            >
          </th>
          <td>US</td>
          <td>Analýza chování na webu ${
            this.options.site || window.location.host
          }</td>
        </tr>
        <tr>
          <th>
            <a
              target="_blank"
              href="https://www.facebook.com/"
              rel="noreferrer noopener"
              >Facebook</a
            >
          </th>
          <td>US</td>
          <td>Cílená reklama, analýza chování na webu</td>
        </tr>
        <!--<tr>
          <th>
            <a
              target="_blank"
              href="https://www.twitter.com/"
              rel="noreferrer noopener"
              >Twitter</a
            >
          </th>
          <td>US</td>
          <td>
            Sdílení (pokud kliknete na webové stránce&nbsp;<a
              href="http://www.${this.options.site || window.location.host}/"
              >www.${this.options.site || window.location.host}</a
            >&nbsp;na odkaz Twitter, budete přesměrováni na profil
            společnosti Stock Plzeň - Božkov s.r.o. na Twitteru)
          </td>
        </tr>-->
      </tbody>
    </table>
  </figure></div></div></div>`;
  }

  /**
   * create cookie banner elements in a container
   * @param {Element} container element to replace
   */
  create(container) {
    this.container = container;
    this.container.innerHTML = `${this.html} ${this.policyHtml}`;
    document.querySelector(`.cookiematic--accept-all`).onclick = () => {
      this.savePreferences({ marketing: true, analytics: true });
    };
    document.querySelector(`.cookiematic--accept-none`).onclick = () => {
      this.savePreferences({ marketing: false, analytics: false });
    };
    document.querySelector(`.cookiematic--accept-form`).onclick = () => {
      this.savePreferencesForm();
    };
    document.querySelector(`.cookiematic--float`).onclick = () => {
      this.showSettings();
      return false;
    };
    const policyDrop = document.querySelector(".cookiematic--drop-policy");
    policyDrop.onclick = (ev) => {
      if (ev.target === policyDrop) this.hidePolicy();
    };
    document.querySelector(".cookiematic--close").onclick = () =>
      this.hidePolicy();
    document.querySelector(".cookiematic--open-policy").onclick = () => {
      this.showPolicy();
      return false;
    };
  }

  #show(suffix) {
    document
      .querySelector(`.cookiematic--drop-${suffix}`)
      .classList.add("show");
  }

  #hide(suffix) {
    document
      .querySelector(`.cookiematic--drop-${suffix}`)
      .classList.remove("show");
  }

  showSettings() {
    if (this.container) this.create(this.container);
    this.#show("settings");
  }

  hideSettings() {
    this.#hide("settings");
  }

  showPolicy() {
    this.#show("policy");
  }

  hidePolicy() {
    this.#hide("policy");
  }
}
