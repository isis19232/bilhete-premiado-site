// Consentimento (LGPD), origem do tráfego e eventos do Meta Pixel.
// O código-base do Pixel fica no <head> e só é carregado depois que o visitante aceita.
// Lead não é disparado: o site não possui mecanismo verificável de manifestação de interesse.
(function () {
  if (window.__bpPixelEvents) return;
  window.__bpPixelEvents = true;

  var CONSENT_KEY = 'bp_consent';
  var ORIGIN_KEY = 'bp_origin';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  window.dataLayer = window.dataLayer || [];

  function store(type, key, value) {
    try { window[type].setItem(key, value); } catch (e) {}
  }
  function read(type, key) {
    try { return window[type].getItem(key); } catch (e) { return null; }
  }
  function eventId(name) {
    return name + '.' + Date.now() + '.' + Math.random().toString(36).slice(2, 10);
  }

  // Origem do acesso: guardada durante a sessão e substituída se o visitante chegar por uma nova campanha.
  function captureOrigin() {
    var params = new URLSearchParams(window.location.search);
    var utm = {};
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) utm[key] = value.slice(0, 100);
    });
    var saved = null;
    try { saved = JSON.parse(read('sessionStorage', ORIGIN_KEY)); } catch (e) {}

    if (!Object.keys(utm).length && saved) return saved;

    var referrer = '';
    try {
      var ref = document.referrer && new URL(document.referrer);
      if (ref && ref.hostname !== window.location.hostname) referrer = ref.hostname;
    } catch (e) {}

    var origin = utm;
    origin.traffic_source = utm.utm_source || (params.has('fbclid') ? 'facebook' : referrer || 'direto');
    origin.landing_page = window.location.pathname;
    store('sessionStorage', ORIGIN_KEY, JSON.stringify(origin));
    return origin;
  }

  var origin = captureOrigin();
  var consent = read('localStorage', CONSENT_KEY);

  function track(name, data) {
    var payload = Object.assign({}, origin, data);
    var id = eventId(name);
    if (typeof window.fbq === 'function' && consent === 'granted') {
      window.fbq('track', name, payload, { eventID: id });
    }
    window.dataLayer.push(Object.assign({ event: 'bp_' + name.toLowerCase(), event_id: id }, payload));
  }

  // ViewContent: uma única vez por seção relevante a cada carregamento da página.
  var sections = {
    'como-funciona': 'Como funciona',
    'informacoes': 'Informações dos sorteios',
    'faq': 'Dúvidas frequentes'
  };
  var viewed = {};
  var observing = false;

  function observeSections() {
    if (observing || !('IntersectionObserver' in window)) return;
    observing = true;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (!entry.isIntersecting || viewed[id]) return;
        viewed[id] = true;
        observer.unobserve(entry.target);
        track('ViewContent', { content_name: sections[id], content_category: 'Informações' });
      });
    }, { rootMargin: '-35% 0px -35% 0px' });
    Object.keys(sections).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Contact: tentativa de contato pelo WhatsApp (não é venda nem conversa confirmada).
  // Não envia número de telefone. Toques repetidos no mesmo botão em menos de 2 segundos contam uma vez.
  var lastContact = {};

  function onContact(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (!/^https:\/\/(wa\.me|api\.whatsapp\.com|wa\.link)\//.test(href)) return;

    var section = link.closest('section[id], header, footer');
    var button = link.getAttribute('data-bp-button') || (link.textContent || '').trim().slice(0, 40) || 'whatsapp';
    var now = Date.now();
    if (lastContact[button] && now - lastContact[button] < 2000) return;
    lastContact[button] = now;

    track('Contact', {
      content_name: 'WhatsApp',
      content_category: 'Tentativa de contato',
      contact_channel: 'whatsapp',
      city: link.getAttribute('data-bp-city') || 'não informada',
      seller: link.getAttribute('data-bp-seller') || 'não informado',
      button: button,
      page_path: window.location.pathname,
      page_section: section ? (section.id || section.tagName.toLowerCase()) : 'pagina'
    });
  }

  document.addEventListener('click', onContact);
  document.addEventListener('auxclick', onContact);

  // Aviso de privacidade: o Pixel permanece desligado até o visitante aceitar.
  var banner;

  function setConsent(value) {
    consent = value;
    store('localStorage', CONSENT_KEY, value);
    if (value === 'granted') {
      if (typeof window.fbq === 'function') window.fbq('consent', 'grant');
      else if (typeof window.bpLoadMetaPixel === 'function') window.bpLoadMetaPixel();
    } else if (typeof window.fbq === 'function') {
      window.fbq('consent', 'revoke');
    }
    hideBanner();
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function showBanner() {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'consent-banner';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', 'Aviso de privacidade');
      banner.innerHTML =
        '<p>Usamos cookies da Meta (Facebook e Instagram) para medir visitas e cliques vindos dos nossos anúncios. ' +
        'Nenhum dado é coletado para esse fim sem a sua autorização, e você pode mudar sua escolha a qualquer momento ' +
        'em “Preferências de privacidade”, no rodapé.</p>' +
        '<div class="consent-actions">' +
        '<button type="button" class="consent-btn consent-reject">Recusar</button>' +
        '<button type="button" class="consent-btn consent-accept">Aceitar</button>' +
        '</div>';
      banner.querySelector('.consent-accept').addEventListener('click', function () { setConsent('granted'); });
      banner.querySelector('.consent-reject').addEventListener('click', function () { setConsent('denied'); });
      document.body.appendChild(banner);
    }
    banner.hidden = false;
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('[data-bp-consent-open]')) showBanner();
  });

  if (!consent) showBanner();
  observeSections();
})();
