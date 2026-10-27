/* apply the saved light/dark choice before the page paints */
try { var t = localStorage.getItem("mdc_admin_theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) {}
