(() => {
  const nav = document.querySelector('.site-nav');
  let previousY = window.scrollY;
  let ticking = false;

  // La barre reste visible en haut de page, se cache en descendant et revient
  // dès que l'utilisateur remonte suffisamment pour vouloir naviguer.
  function updateNavigation() {
    const currentY = window.scrollY;
    const delta = currentY - previousY;
    if (currentY < 80 || delta < -3) {
      nav?.classList.remove('nav-hidden');
    } else if (delta > 3 && currentY > 120) {
      nav?.classList.add('nav-hidden');
    }
    previousY = currentY;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavigation);
      ticking = true;
    }
  }, { passive: true });

  // Navigation interne douce et fermeture visuelle de la navbar après clic.
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.site-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      nav?.classList.remove('nav-hidden');
    });
  });

  // Apparitions au scroll : GSAP est facultatif, le contenu reste visible sans lui.
  function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.skill-category__title').forEach(title => {
      gsap.fromTo(title, { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, duration: .55,
        scrollTrigger: { trigger: title, start: 'top 94%', once: true }
      });
    });
    gsap.utils.toArray('.skill').forEach((skill, index) => {
      gsap.fromTo(skill, { y: 35, opacity: 0 }, {
        y: 0, opacity: 1, duration: .7, delay: (index % 4) * .06,
        scrollTrigger: { trigger: skill, start: 'top 92%', once: true }
      });
    });
    gsap.utils.toArray('.home-section .entry').forEach(entry => {
      const meta = entry.querySelector('.entry__meta');
      const media = entry.querySelector('.entry__media');
      if (meta) gsap.fromTo(meta, { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: .8, scrollTrigger: { trigger: entry, start: 'top 88%', once: true } });
      if (media) gsap.fromTo(media, { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: .8, scrollTrigger: { trigger: entry, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('.present .entry').forEach(entry => {
      gsap.fromTo(entry, { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: .65, scrollTrigger: { trigger: entry, start: 'top 92%', once: true } });
    });
  }
  window.addEventListener('load', initAnimations, { once: true });

  // L'adresse reste reconstituée côté navigateur comme dans l'ancien portfolio.
  document.querySelectorAll('.emailObfusquee').forEach(element => {
    const user = element.dataset.emailUser;
    const domain = element.dataset.emailDomain;
    if (!user || !domain) return;
    const address = `${user}@${domain}`;
    const anchor = document.createElement('a');
    anchor.href = `mailto:${address}`;
    anchor.textContent = address;
    element.replaceChildren(anchor);
  });

  // Le formulaire d'origine ne disposait pas de serveur d'envoi. On prépare
  // donc un e-mail prérempli plutôt que de simuler un envoi côté navigateur.
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Prise de contact — ${data.get('name')}`);
    const body = encodeURIComponent(
      `Nom : ${data.get('name')}\nEmail : ${data.get('email')}\nEntreprise : ${data.get('company')}\nPoste : ${data.get('role') || 'Non précisé'}\n\nMessage :\n${data.get('message')}`
    );
    window.location.href = `mailto:victor.frappaz@etu.univ-grenoble-alpes.fr?subject=${subject}&body=${body}`;
  });
})();