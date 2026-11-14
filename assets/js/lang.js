/* ==========================================================================
   MALIK DATA CENTRE — site language switch
   Same control as the homepage: a dropdown that drives Google Translate.
   Loaded on the homepage, on every page build-pages.js emits (including
   blog posts), and injected by cms.js on older hand-written blog pages
   that have no selector of their own.
   The English page is the only indexable version. Translation happens in
   the browser after load; it is not a separate URL.
   ========================================================================== */
(function () {
    "use strict";

    var LANGS = [
        ["en", "🌐 English"],
        ["ur", "🇵🇰 Urdu (اردو)"],
        ["hi", "🇮🇳 Hindi (हिन्दी)"],
        ["bn", "🇧🇩 Bangla (বাংলা)"],
        ["ne", "🇳🇵 Nepali (नेपाली)"],
        ["ar", "🇸🇦 Arabic (العربية)"],
        ["ps", "🇦🇫 Pashto / Afghani (پښتو)"],
        ["ta", "🇮🇳 Tamil (தமிழ்)"],
        ["pa", "🇵🇰 Punjabi (ਪੰਜਾਬੀ)"],
        ["it", "🇮🇹 Italian (Italiano)"],
        ["tr", "🇹🇷 Turkish (Türkçe)"],
        ["uz", "🇺🇿 Uzbek (Oʻzbek)"],
        ["es", "🇪🇸 Spanish (Español)"],
        ["af", "🇿🇦 African (Afrikaans)"],
        ["de", "🇩🇪 German (Deutsch)"],
        ["pl", "🇵🇱 Polish (Polski)"],
        ["ga", "🇮🇪 Irish (Gaeilge)"],
        ["hu", "🇭🇺 Hungarian (Magyar)"],
        ["ru", "🇷🇺 Russian (Русский)"],
        ["fr", "🇫🇷 French (Français)"],
        ["zh-CN", "🇨🇳 Chinese (中文)"],
        ["ja", "🇯🇵 Japanese (日本語)"],
        ["ko", "🇰🇷 Korean (한국어)"]
    ];
    /* `pt` is in the homepage widget allow-list but not in the dropdown. */
    var INCLUDED = LANGS.map(function (x) { return x[0]; }).concat(["pt"]).join(",");
    var RTL = { ar: 1, ur: 1, ps: 1 };
    var FONTS = {
        ur: { id: "noto-ur", family: "Noto Nastaliq Urdu", href: "family=Noto+Nastaliq+Urdu:wght@400;600;700", stack: '"Noto Nastaliq Urdu","Noto Sans Arabic",Inter,sans-serif' },
        ar: { id: "noto-ar", family: "Noto Sans Arabic", href: "family=Noto+Sans+Arabic:wght@400;600;700", stack: '"Noto Sans Arabic",Inter,sans-serif' },
        ps: { id: "noto-ar", family: "Noto Sans Arabic", href: "family=Noto+Sans+Arabic:wght@400;600;700", stack: '"Noto Sans Arabic",Inter,sans-serif' },
        hi: { id: "noto-hi", family: "Noto Sans Devanagari", href: "family=Noto+Sans+Devanagari:wght@400;600;700", stack: '"Noto Sans Devanagari",Inter,sans-serif' },
        ne: { id: "noto-hi", family: "Noto Sans Devanagari", href: "family=Noto+Sans+Devanagari:wght@400;600;700", stack: '"Noto Sans Devanagari",Inter,sans-serif' },
        bn: { id: "noto-bn", family: "Noto Sans Bengali", href: "family=Noto+Sans+Bengali:wght@400;600;700", stack: '"Noto Sans Bengali",Inter,sans-serif' },
        ta: { id: "noto-ta", family: "Noto Sans Tamil", href: "family=Noto+Sans+Tamil:wght@400;600;700", stack: '"Noto Sans Tamil",Inter,sans-serif' },
        pa: { id: "noto-pa", family: "Noto Sans Gurmukhi", href: "family=Noto+Sans+Gurmukhi:wght@400;600;700", stack: '"Noto Sans Gurmukhi",Inter,sans-serif' },
        "zh-CN": { id: "noto-zh", family: "Noto Sans SC", href: "family=Noto+Sans+SC:wght@400;600;700", stack: '"Noto Sans SC",Inter,sans-serif' },
        ja: { id: "noto-ja", family: "Noto Sans JP", href: "family=Noto+Sans+JP:wght@400;600;700", stack: '"Noto Sans JP",Inter,sans-serif' },
        ko: { id: "noto-ko", family: "Noto Sans KR", href: "family=Noto+Sans+KR:wght@400;600;700", stack: '"Noto Sans KR",Inter,sans-serif' },
        ru: { id: "noto-ru", family: "Noto Sans", href: "family=Noto+Sans:wght@400;600;700", stack: '"Noto Sans",Inter,sans-serif' }
    };

    function optionsHtml() {
        return LANGS.map(function (o) {
            return '<option value="' + o[0] + '">' + o[1] + "</option>";
        }).join("");
    }

    function selectEl(id) {
        return '<select id="' + id + '" class="mdc-lang-select notranslate" translate="no" aria-label="Select language">' + optionsHtml() + "</select>";
    }

    function ensureStyles() {
        if (document.getElementById("mdc-lang-style")) return;
        var css = document.createElement("style");
        css.id = "mdc-lang-style";
        css.textContent = [
            ".goog-te-banner-frame.skiptranslate,.goog-te-banner-frame,#goog-gt-tt,.goog-te-balloon-frame,.goog-tooltip,.goog-tooltip:hover{display:none!important}",
            "body{top:0!important}",
            ".goog-text-highlight{background:transparent!important;box-shadow:none!important}",
            "#google_translate_element{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}",
            "body>.skiptranslate{display:none!important}",
            "html[data-mdc-lang]:not([data-mdc-lang='en']) body{font-family:var(--mdc-lang-font,Inter,sans-serif)}",
            ".mdc-lang-select.notranslate, .mdc-lang-selector-wrap{font-family:Outfit,Inter,sans-serif}",
            "html[dir='rtl'] .article-body, html[dir='rtl'] .pg-lead, html[dir='rtl'] .blog-crumb{text-align:right}"
        ].join("");
        document.head.appendChild(css);
    }

    function ensureSelectors() {
        if (!document.getElementById("mdc-lang-select")) {
            var wrap = document.createElement("div");
            wrap.className = "mdc-lang-selector-wrap";
            wrap.innerHTML = selectEl("mdc-lang-select");
            var slot = document.querySelector(".blog-header-links") || document.querySelector(".pg-head-cta") || document.querySelector(".navbar-actions") || document.body;
            if (slot === document.body) {
                wrap.style.cssText = "position:fixed;top:12px;right:12px;z-index:200";
                slot.appendChild(wrap);
            } else {
                slot.insertBefore(wrap, slot.firstChild);
            }
        }
        if (!document.getElementById("drawer-lang-select")) {
            var mobile = document.querySelector("[data-pg-mobile], .mobile-drawer .drawer-links");
            if (mobile) {
                var block = document.createElement("div");
                block.className = "drawer-lang-selector-wrap mdc-lang-selector-wrap";
                block.style.cssText = "margin:8px 0 12px;width:100%";
                block.innerHTML = '<label for="drawer-lang-select" style="display:block;margin-bottom:5px;font-size:.85rem;font-weight:600">Language</label>' + selectEl("drawer-lang-select");
                mobile.insertBefore(block, mobile.firstChild);
            }
        }
    }

    function ensureWidget() {
        if (document.getElementById("google_translate_element")) return;
        var holder = document.createElement("div");
        holder.id = "google_translate_element";
        holder.style.display = "none";
        document.body.appendChild(holder);
        window.googleTranslateElementInit = function () {
            if (!window.google || !google.translate) return;
            new google.translate.TranslateElement({
                pageLanguage: "en",
                includedLanguages: INCLUDED,
                autoDisplay: false
            }, "google_translate_element");
        };
        var s = document.createElement("script");
        s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(s);
    }

    function loadFont(lang) {
        var pack = FONTS[lang];
        if (!pack || document.getElementById(pack.id)) {
            if (pack) document.documentElement.style.setProperty("--mdc-lang-font", pack.stack);
            return;
        }
        var link = document.createElement("link");
        link.id = pack.id;
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?" + pack.href + "&display=swap";
        document.head.appendChild(link);
        document.documentElement.style.setProperty("--mdc-lang-font", pack.stack);
    }

    function applyLocale(lang) {
        var code = lang || "en";
        document.documentElement.lang = code;
        document.documentElement.dir = RTL[code] ? "rtl" : "ltr";
        document.documentElement.setAttribute("data-mdc-lang", code);
        if (code === "en") document.documentElement.style.removeProperty("--mdc-lang-font");
        else loadFont(code);
    }

    function setGoogleTranslateCookie(langCode) {
        var domain = window.location.hostname;
        var cookieVal = (langCode && langCode !== "en") ? ("/en/" + langCode) : "";
        var expires = (langCode && langCode !== "en") ? "; expires=Thu, 31 Dec 2037 23:59:59 GMT" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "googtrans=" + cookieVal + expires + "; path=/;";
        if (domain && domain !== "localhost") {
            document.cookie = "googtrans=" + cookieVal + expires + "; path=/; domain=" + domain;
            if (domain.indexOf(".") > -1) {
                document.cookie = "googtrans=" + cookieVal + expires + "; path=/; domain=." + domain.replace(/^www\./, "");
            }
        }
    }

    function setLangSelectorsBusy(isBusy) {
        ["mdc-lang-select", "drawer-lang-select"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.disabled = !!isBusy;
        });
    }

    /* Google's widget translates the current viewport first and picks up the
       rest only after those nodes come into view. Shrink the page for a
       moment so the whole article is "visible", then restore scroll. */
    function sweepForTranslate() {
        var root = document.documentElement;
        if (!root || root.getAttribute("data-mdc-sweep") === "1") return;
        if ((root.getAttribute("data-mdc-lang") || "en") === "en") return;
        root.setAttribute("data-mdc-sweep", "1");
        var y = window.scrollY || 0;
        var prev = root.style.zoom;
        root.style.zoom = "0.05";
        setTimeout(function () {
            root.style.zoom = prev || "";
            window.scrollTo(0, y);
        }, 1400);
    }

    function applyGoogleTranslate(langCode, maxWaitMs) {
        maxWaitMs = maxWaitMs || 8000;
        var startedAt = Date.now();
        setLangSelectorsBusy(true);
        (function tryApply() {
            var combo = document.querySelector(".goog-te-combo");
            if (combo) {
                setLangSelectorsBusy(false);
                if (combo.value !== langCode) {
                    combo.value = langCode;
                    combo.dispatchEvent(new Event("change"));
                }
                if (langCode && langCode !== "en") setTimeout(sweepForTranslate, 350);
                return;
            }
            if (Date.now() - startedAt >= maxWaitMs) {
                setLangSelectorsBusy(false);
                return;
            }
            setTimeout(tryApply, 250);
        })();
    }

    window.initLanguageSelector = function () {
        var savedLang = "en";
        try { savedLang = localStorage.getItem("mdc_language") || "en"; } catch (e) {}
        if (savedLang === "en") setGoogleTranslateCookie("en");
        applyLocale(savedLang);
        ["mdc-lang-select", "drawer-lang-select"].forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            el.value = savedLang;
            el.onchange = function (e) { window.changeSiteLanguage(e.target.value); };
        });
        if (savedLang && savedLang !== "en") {
            setGoogleTranslateCookie(savedLang);
            applyGoogleTranslate(savedLang);
        }
    };

    window.changeSiteLanguage = function (langCode) {
        if (!langCode) return;
        document.documentElement.removeAttribute("data-mdc-sweep");
        try { localStorage.setItem("mdc_language", langCode); } catch (e) {}
        setGoogleTranslateCookie(langCode);
        applyLocale(langCode);
        ["mdc-lang-select", "drawer-lang-select"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.value = langCode;
        });
        applyGoogleTranslate(langCode);
    };

    function boot() {
        ensureStyles();
        ensureSelectors();
        ensureWidget();
        window.initLanguageSelector();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();
