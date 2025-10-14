(function () {
  // Parâmetros
  const IMG_MAX_RATIO = 0.15; // 15% da viewport
  const MIN_IMG_WIDTH = 80;

  function adjustSingleCard(card) {
    const img = card.querySelector('img');
    if (!img) return;
    // garante que a imagem não exceda 15% da viewport (CSS já aplica, aqui é fallback)
    const maxImgWidthPx = Math.max(MIN_IMG_WIDTH, Math.floor(window.innerWidth * IMG_MAX_RATIO));
    if (img.naturalWidth && img.naturalWidth > maxImgWidthPx) {
      // limita via style apenas se exceder (não força se CSS já aplica)
      img.style.maxWidth = maxImgWidthPx + 'px';
      img.style.height = 'auto';
    } else {
      img.style.maxWidth = '';
      img.style.height = '';
    }
  }

  function adjustAll() {
    const cards = document.querySelectorAll('.card-custom, .order-card, .quadro-pendente');
    cards.forEach(adjustSingleCard);
  }

  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(adjustAll, 120);
  }

  document.addEventListener('DOMContentLoaded', adjustAll);
  window.addEventListener('load', adjustAll);
  window.addEventListener('resize', onResize);

  // observer para conteúdo dinâmico
  const observer = new MutationObserver((mutations) => {
    let dirty = false;
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) { dirty = true; break; }
    }
    if (dirty) adjustAll();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
