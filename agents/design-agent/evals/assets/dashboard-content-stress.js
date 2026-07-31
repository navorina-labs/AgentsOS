(() => {
  if (window.__contentStress?.ready) return;

  const setText = (selector, value, index = 0) => {
    const node = document.querySelectorAll(selector)[index];
    if (!node) throw new Error(`Missing content-stress target: ${selector}[${index}]`);
    node.textContent = value;
  };

  const setPlaceholder = (selector, value) => {
    const node = document.querySelector(selector);
    if (!node) throw new Error(`Missing content-stress input: ${selector}`);
    node.placeholder = value;
  };

  const setOption = (selector, index, value) => {
    const select = document.querySelector(selector);
    if (!select?.options[index]) {
      throw new Error(`Missing content-stress option: ${selector}[${index}]`);
    }
    select.options[index].textContent = value;
  };

  const applyPseudo = () => {
    document.documentElement.lang = "de-x-pseudo";
    document.documentElement.dir = "ltr";
    document.title = "[!! Betriebs- und Kundendienstübersicht !!]";

    setText(".skip-link", "[!! Direkt zum Arbeitsbereich springen !!]");
    setText(".site-header h1", "[!! Betriebsübersicht für Kundendienstteams !!]");
    setPlaceholder("#global-search", "[!! Alle Vorgänge, Kunden und Ereignisse durchsuchen !!]");
    setText(".header-actions > .primary", "[!! Neuen Supportvorgang erstellen !!]");
    setText(".header-actions > .secondary", "[!! Bericht exportieren und herunterladen !!]", 0);
    setText(".header-actions > .secondary", "[!! Arbeitsbereichseinstellungen verwalten !!]", 1);
    setText(".header-menu summary", "[!! Weitere Aktionen anzeigen !!]");
    setText(".menu-panel button", "[!! Bericht exportieren und herunterladen !!]", 0);
    setText(".menu-panel button", "[!! Arbeitsbereichseinstellungen verwalten !!]", 1);

    setText("#incidents-heading", "[!! Aktive geschäftskritische Vorfälle !!]");
    setText(
      ".section-heading p",
      "[!! 3 aktive Vorfälle · 12.768 betroffene Supportvorgänge !!]",
    );
    setText(".incident h3", "Zahlungsabwicklungs- und Rückerstattungsschnittstelle", 0);
    setText(".incident h3", "Verzögerung bei der Unternehmensanmeldung", 1);
    setText(".incident h3", "Webhook-Ereignisübermittlung an internationale Partner", 2);
    setText(
      ".incident p",
      "[!! Verantwortlich: Noch nicht zugewiesen · 10.842 Vorgänge !!]",
      0,
    );
    setText(".incident-actions .primary", "[!! Verantwortliche Person zuweisen !!]");
    [...document.querySelectorAll(".incident-actions .secondary")].forEach(
      (button) => (button.textContent = "[!! Vollständige Details öffnen !!]"),
    );

    setText(".panel-title", "[!! Betroffene Supportvorgänge und Kundenanfragen !!]");
    setPlaceholder(
      "#ticket-search",
      "[!! Kennung, ausführliche Betreffzeile oder Kundenorganisation !!]",
    );
    const labels = [
      "[!! Supportvorgänge durchsuchen !!]",
      "[!! Gespeicherte Ansicht auswählen !!]",
      "[!! Bearbeitungsstatus auswählen !!]",
      "[!! Geschäftliche Priorität auswählen !!]",
      "[!! Verantwortliche Person auswählen !!]",
      "[!! Eingangskanal auswählen !!]",
    ];
    [...document.querySelectorAll(".toolbar .field label")].forEach(
      (label, index) => (label.textContent = labels[index]),
    );
    setOption("#view", 0, "[!! Alle gespeicherten Ansichten anzeigen !!]");
    setOption("#status", 0, "[!! Alle Bearbeitungsstatus anzeigen !!]");
    setOption("#priority", 0, "[!! Alle geschäftlichen Prioritäten anzeigen !!]");
    setOption("#owner", 0, "[!! Alle verantwortlichen Personen anzeigen !!]");
    setOption("#channel", 0, "[!! Alle Eingangskanäle anzeigen !!]");
    setText(".toolbar-actions .primary", "[!! Filter auf Ergebnisliste anwenden !!]");
    setText(".toolbar-actions .secondary", "[!! Ausgewählte Vorgänge gemeinsam bearbeiten !!]");

    setText("tbody tr td:nth-child(4)", "Rückerstattung für internationale Firmenkarte doppelt ausgelöst", 0);
    setText("tbody tr td:nth-child(8)", "Nordwestliche Handelsgesellschaft mit beschränkter Haftung", 0);
    setText(
      ".ticket-title",
      "#8941 · Rückerstattung für internationale Firmenkarte doppelt ausgelöst",
      0,
    );
    setText(
      ".ticket-context",
      "Zahlungsabwicklungs- und Rückerstattungsschnittstelle · Nordwestliche Handelsgesellschaft mit beschränkter Haftung · vor 2 Minuten",
      0,
    );
    setText(".selection-status", "[!! 0 von 12.768 Supportvorgängen ausgewählt !!]");
    setText(".pagination .secondary", "[!! Vorherige Ergebnisseite !!]", 0);
    setText(".pagination .secondary", "[!! Nächste Ergebnisseite !!]", 1);
    setText(".pagination .quiet", "[!! Ergebnisliste als Datei exportieren !!]");

    setText(".supporting .panel-title", "[!! Supportvorgangsvolumen der letzten sechs Arbeitstage !!]", 0);
    setText(".supporting .panel-title", "[!! Letzte Aktivitäten im Arbeitsbereich !!]", 1);
    setText(".metrics-section .section-heading h2", "[!! Betriebliche Leistungskennzahlen !!]");
    setText(".metrics-section .section-heading p", "[!! Stand: heutiger Geschäftstag !!]");

    window.__contentStress.mode = "pseudo";
  };

  const applyRTL = () => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.title = "نظرة عامة على العمليات";

    setText(".skip-link", "انتقل إلى العمليات");
    setText(".site-header h1", "نظرة عامة على العمليات");
    setPlaceholder("#global-search", "البحث في جميع العمليات والعملاء");
    setText(".header-actions > .primary", "إنشاء تذكرة جديدة");
    setText(".header-actions > .secondary", "تصدير", 0);
    setText(".header-actions > .secondary", "الإعدادات", 1);
    setText(".header-menu summary", "المزيد");
    setText(".menu-panel button", "تصدير", 0);
    setText(".menu-panel button", "الإعدادات", 1);

    setText("#incidents-heading", "الحوادث النشطة");
    setText(".section-heading p", "3 حوادث · 267 تذكرة متأثرة");
    setText(".incident h3", "واجهة المدفوعات API-PAY-8941", 0);
    setText(".incident h3", "زمن استجابة تسجيل الدخول", 1);
    setText(".incident h3", "تأخر Webhooks للشريك ACME-42", 2);
    setText(".incident p", "المالك: غير معيّن · 142 تذكرة", 0);
    setText(".incident p", "المالك: Maya · 86 تذكرة", 1);
    setText(".incident p", "المالك: Devon · 39 تذكرة", 2);
    setText(".incident-actions .primary", "تعيين المالك");
    [...document.querySelectorAll(".incident-actions .secondary")].forEach(
      (button) => (button.textContent = "فتح"),
    );

    setText(".panel-title", "التذاكر المتأثرة");
    setPlaceholder("#ticket-search", "المعرّف أو الموضوع أو العميل");
    const labels = ["بحث التذاكر", "العرض", "الحالة", "الأولوية", "المالك", "القناة"];
    [...document.querySelectorAll(".toolbar .field label")].forEach(
      (label, index) => (label.textContent = labels[index]),
    );
    setText(".toolbar-actions .primary", "تطبيق");
    setText(".toolbar-actions .secondary", "تعديل جماعي");
    setText("tbody tr td:nth-child(4)", "تم عكس دفعة البطاقة مرتين للعميل ACME-8941", 0);
    setText("tbody tr td:nth-child(8)", "شركة النور الدولية ACME-42", 0);
    setText(".ticket-title", "#8941 · تم عكس دفعة البطاقة مرتين", 0);
    setText(".ticket-context", "واجهة المدفوعات API-PAY-8941 · شركة النور الدولية ACME-42 · قبل دقيقتين", 0);
    setText(".selection-status", "تم تحديد 0 تذكرة");
    setText(".pagination .secondary", "السابق", 0);
    setText(".pagination .secondary", "التالي", 1);
    setText(".pagination .quiet", "تصدير");
    setText(".supporting .panel-title", "حجم التذاكر", 0);
    setText(".supporting .panel-title", "النشاط", 1);
    setText(".metrics-section .section-heading h2", "مقاييس التشغيل");
    setText(".metrics-section .section-heading p", "اليوم");

    window.__contentStress.mode = "rtl";
  };

  const applyText200 = () => {
    const style = document.createElement("style");
    style.dataset.contentStressText200 = "true";
    style.textContent = `
      body, button, input, select, summary { font-size: 28px !important; }
      .site-header h1 { font-size: 40px !important; }
      .section-heading h2 { font-size: 36px !important; }
      .panel-title { font-size: 32px !important; }
      .incident h3 { font-size: 30px !important; }
      .severity, .field label, table, .ticket-meta, .ticket-context {
        font-size: 24px !important;
      }
      .metric b { font-size: 48px !important; }
      .bar span { font-size: 22px !important; }
    `;
    document.head.append(style);
    window.__contentStress.mode = "text-200";
  };

  window.__contentStress = {
    ready: true,
    mode: "default",
    apply(mode) {
      if (mode === "pseudo") applyPseudo();
      else if (mode === "rtl") applyRTL();
      else if (mode === "text-200") applyText200();
      else throw new Error(`Unknown content-stress mode: ${mode}`);
      return {mode: this.mode, lang: document.documentElement.lang, dir: document.dir};
    },
  };
})();
