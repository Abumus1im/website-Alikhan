// ================================================================
// script.js – полная версия с улучшениями
// Включает:
// - Плавное появление секций (Intersection Observer)
// - Слайдер отзывов с точками-индикаторами
// - Маску телефона (Inputmask)
// - Скачивание прайс-листа (реальный файл)
// - Обработку формы подписки в футере
// - Автообновление года в копирайте
// - Улучшенное закрытие мобильного меню
// - Лайтбокс для сертификатов (галерея с перелистыванием)
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
  // ===== ПЕРЕМЕННЫЕ =====
  const body = document.body;
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollTopBtn = document.getElementById('scrollTop');
  const bookingModal = document.getElementById('bookingModal');
  const questionModal = document.getElementById('questionModal');
  const videoModal = document.getElementById('videoModal');
  const openBookingModalBtns = document.querySelectorAll('#openBookingModal, #heroBookingBtn');
  const closeBookingModalBtn = document.getElementById('closeBookingModal');
  const closeQuestionModalBtn = document.getElementById('closeQuestionModal');
  const closeVideoModalBtn = document.getElementById('closeVideoModal');
  const askQuestionBtn = document.getElementById('askQuestion');
  const playVideoBtn = document.getElementById('playVideoBtn');
  const bookingForm = document.getElementById('bookingForm');
  const questionForm = document.getElementById('questionForm');
  const contactForm = document.getElementById('contactForm');
  const bookServiceBtns = document.querySelectorAll('.book-service');
  const bookConsultationBtns = document.querySelectorAll('.book-consultation');
  const bookingServiceInput = document.getElementById('bookingService');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  const reviewsContainer = document.getElementById('reviewsContainer');
  const prevReviewBtn = document.getElementById('prevReview');
  const nextReviewBtn = document.getElementById('nextReview');
  const addReviewBtn = document.getElementById('addReviewBtn');
  const downloadPriceBtn = document.getElementById('downloadPrice');
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const quickContacts = document.querySelector('.quick-contacts');
  const dotsContainer = document.getElementById('sliderDots');

  // ===== ОБЩИЕ ФУНКЦИИ =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===== HEADER SCROLL EFFECT =====
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', debounce(handleHeaderScroll, 10));

  // ===== МОБИЛЬНОЕ МЕНЮ =====
  function toggleMobileMenu() {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    body.classList.toggle('no-scroll');
  }

  if (burger && nav) {
    burger.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('no-scroll');
      });
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') && 
          !nav.contains(e.target) && 
          !burger.contains(e.target)) {
        burger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        burger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    });
  }

  // ===== ACTIVE NAV LINK ON SCROLL =====
  function setActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    navLinks.forEach(link => {
      const sectionId = link.getAttribute('href');
      if (sectionId.startsWith('#')) {
        const section = document.querySelector(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      }
    });
  }
  window.addEventListener('scroll', debounce(setActiveNavLink, 10));

  // ===== SMOOTH SCROLL =====
  function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#' || !targetId.startsWith('#')) return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      history.pushState(null, null, targetId);
      if (nav.classList.contains('active')) {
        burger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    }
  }
  navLinks.forEach(link => link.addEventListener('click', smoothScroll));

  // ===== SCROLL TO TOP BUTTON =====
  function toggleScrollTopButton() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
  if (scrollTopBtn) {
    window.addEventListener('scroll', toggleScrollTopButton);
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== MODAL WINDOWS =====
  function openModal(modal) {
    modal.classList.add('active');
    body.classList.add('no-scroll');
  }
  function closeModal(modal) {
    modal.classList.remove('active');
    body.classList.remove('no-scroll');
  }

  openBookingModalBtns.forEach(btn => btn.addEventListener('click', () => openModal(bookingModal)));
  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service');
      bookingServiceInput.value = service;
      openModal(bookingModal);
    });
  });
  bookConsultationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      bookingServiceInput.value = type;
      openModal(bookingModal);
    });
  });
  if (closeBookingModalBtn) closeBookingModalBtn.addEventListener('click', () => closeModal(bookingModal));
  if (askQuestionBtn) askQuestionBtn.addEventListener('click', () => openModal(questionModal));
  if (closeQuestionModalBtn) closeQuestionModalBtn.addEventListener('click', () => closeModal(questionModal));

  if (playVideoBtn && videoModal) playVideoBtn.addEventListener('click', () => openModal(videoModal));
  if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', () => closeModal(videoModal));
  if (videoModal) {
    videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeModal(videoModal); });
  }

  [bookingModal, questionModal, videoModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookingModal && bookingModal.classList.contains('active')) closeModal(bookingModal);
      if (questionModal && questionModal.classList.contains('active')) closeModal(questionModal);
      if (videoModal && videoModal.classList.contains('active')) closeModal(videoModal);
    }
  });

  // ===== FORM SUBMISSION =====
  function showSuccessMessage(message) { alert(message); }
  function showErrorMessage(message) { alert('Ошибка: ' + message); }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      if (!name || !phone) { showErrorMessage('Пожалуйста, заполните обязательные поля'); return; }
      const service = bookingServiceInput.value;
      showSuccessMessage(`Спасибо, ${name}! Ваша запись на "${service}" принята. Мы свяжемся с вами по номеру ${phone} для подтверждения.`);
      closeModal(bookingModal);
      this.reset();
      bookingServiceInput.value = '';
    });
  }

  if (questionForm) {
    questionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('questionName').value.trim();
      const email = document.getElementById('questionEmail').value.trim();
      const text = document.getElementById('questionText').value.trim();
      if (!name || !email || !text) { showErrorMessage('Пожалуйста, заполните все поля'); return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { showErrorMessage('Пожалуйста, введите корректный email'); return; }
      showSuccessMessage(`Спасибо за ваш вопрос, ${name}! Я отвечу вам на email ${email} в течение 24 часов.`);
      closeModal(questionModal);
      this.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      if (!name || !phone) { showErrorMessage('Пожалуйста, заполните обязательные поля'); return; }
      showSuccessMessage(`Спасибо, ${name}! Ваша заявка принята. Мы свяжемся с вами по номеру ${phone} в ближайшее время.`);
      this.reset();
    });
  }

  // ===== SERVICES TABS =====
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const tabId = this.getAttribute('data-tab');
      if (tabId === 'surgery' && !localStorage.getItem('ageConfirmed')) {
        const confirmed = confirm('Внимание! Этот раздел содержит фото интимного характера. Вам исполнилось 18 лет?');
        if (!confirmed) { e.preventDefault(); return false; }
        else { localStorage.setItem('ageConfirmed', 'true'); }
      }
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      this.classList.add('active');
      const tabPane = document.getElementById(`${tabId}-tab`);
      if (tabPane) tabPane.classList.add('active');
    });
  });

  // ===== FAQ ACCORDION =====
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ===== REVIEWS SLIDER (с точками) =====
  let currentReview = 0;
  const reviewCards = document.querySelectorAll('.review-card');
  const totalReviews = reviewCards.length;

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalReviews; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === currentReview) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentReview = i;
        updateReviewsSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateReviewsSlider() {
    if (reviewsContainer && reviewCards.length > 0) {
      const cardWidth = reviewCards[0].offsetWidth + 32;
      reviewsContainer.style.transform = `translateX(-${currentReview * cardWidth}px)`;
    }
    updateDots();
  }

  if (prevReviewBtn && nextReviewBtn && reviewsContainer) {
    prevReviewBtn.addEventListener('click', () => {
      currentReview = currentReview > 0 ? currentReview - 1 : totalReviews - 1;
      updateReviewsSlider();
    });
    nextReviewBtn.addEventListener('click', () => {
      currentReview = currentReview < totalReviews - 1 ? currentReview + 1 : 0;
      updateReviewsSlider();
    });
    window.addEventListener('resize', debounce(updateReviewsSlider, 100));
    if (totalReviews > 0) {
      updateDots();
      updateReviewsSlider();
    }
  }

  if (addReviewBtn) {
    addReviewBtn.addEventListener('click', () => {
      showSuccessMessage('Спасибо за желание оставить отзыв! Вы можете оставить отзыв на Яндекс.Картах или Google Maps. Также вы можете написать отзыв мне в WhatsApp или Telegram.');
    });
  }

  // ===== СКАЧИВАНИЕ ПРАЙС-ЛИСТА =====
  if (downloadPriceBtn) {
    downloadPriceBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = '/price.pdf'; // замените на свой путь
      link.download = 'Price_Ibragimov.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ===== DATE INPUTS =====
  dateInputs.forEach(input => {
    const today = new Date().toISOString().split('T')[0];
    input.min = today;
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    input.max = maxDate.toISOString().split('T')[0];
  });

  // ===== QUICK CONTACTS HIDE ON SCROLL =====
  let lastScrollTop = 0;
  function handleQuickContactsScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 300) {
      if (quickContacts) {
        quickContacts.style.opacity = '0';
        quickContacts.style.transform = 'translateY(20px)';
      }
    } else {
      if (quickContacts) {
        quickContacts.style.opacity = '1';
        quickContacts.style.transform = 'translateY(0)';
      }
    }
    lastScrollTop = scrollTop;
  }
  window.addEventListener('scroll', debounce(handleQuickContactsScroll, 50));

  // ===== АККОРДЕОН В "ОБО МНЕ" =====
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      item.classList.toggle('active');
    });
  });

// ===== ЛАЙТБОКС ДЛЯ СЕРТИФИКАТОВ (С ГРУППИРОВКОЙ ПО ДОКУМЕНТАМ) =====
const certThumbs = document.querySelectorAll('.cert-thumb');
let currentGroup = [];               // массив изображений текущего документа
let currentIndex = 0;               // индекс внутри currentGroup
let currentBaseTitle = '';          // базовое название документа

// Создаём разметку лайтбокса
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Закрыть">&times;</button>
  <button class="lightbox-nav prev" aria-label="Предыдущая страница"><i class="fas fa-chevron-left"></i></button>
  <button class="lightbox-nav next" aria-label="Следующая страница"><i class="fas fa-chevron-right"></i></button>
  <div class="lightbox-content">
    <img class="lightbox-image" src="" alt="">
    <div class="lightbox-caption"></div>
    <div class="lightbox-counter"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxCounter = lightbox.querySelector('.lightbox-counter');
const closeBtn = lightbox.querySelector('.lightbox-close');
const prevBtn = lightbox.querySelector('.prev');
const nextBtn = lightbox.querySelector('.next');

// Функция открытия лайтбокса для конкретной группы
function openLightbox(group, baseTitle, startIndex = 0) {
  currentGroup = group;
  currentBaseTitle = baseTitle;
  currentIndex = startIndex;
  updateLightboxContent();
  lightbox.classList.add('active');
  body.classList.add('no-scroll');
}

// Обновление контента (картинка, подпись, счётчик)
function updateLightboxContent() {
  if (!currentGroup.length) return;
  const src = currentGroup[currentIndex];
  lightboxImage.src = src;
  lightboxImage.alt = currentBaseTitle;
  
  // Формируем подпись
  let caption = currentBaseTitle;
  if (currentGroup.length > 1) {
    caption += ` (лист ${currentIndex + 1}/${currentGroup.length})`;
  }
  lightboxCaption.textContent = caption;
  
  // Счётчик (только если больше одной страницы)
  if (currentGroup.length > 1) {
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
    lightboxCounter.style.display = 'block';
  } else {
    lightboxCounter.style.display = 'none';
  }
  
  // Управление видимостью стрелок (если одна страница — скрываем)
  if (currentGroup.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  }
}

// Закрытие лайтбокса
function closeLightbox() {
  lightbox.classList.remove('active');
  body.classList.remove('no-scroll');
}

// Переключение внутри текущей группы
function showPrev() {
  if (currentGroup.length === 0) return;
  currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
  updateLightboxContent();
}

function showNext() {
  if (currentGroup.length === 0) return;
  currentIndex = (currentIndex + 1) % currentGroup.length;
  updateLightboxContent();
}

// Инициализация: привязываем обработчики к миниатюрам
function initCertificates() {
  certThumbs.forEach((thumb) => {
    const srcData = thumb.dataset.src;
    const baseTitle = thumb.dataset.title || 'Документ';
    
    let urls = [];
    try {
      // Парсим JSON-массив
      if (srcData && srcData.trim().startsWith('[')) {
        urls = JSON.parse(srcData);
      } else if (srcData) {
        urls = [srcData];
      }
    } catch (e) {
      console.warn('Ошибка парсинга data-src:', srcData);
      urls = [srcData];
    }
    
    // Фильтруем пустые значения
    urls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '');
    
    if (urls.length === 0) return;
    
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      // Открываем лайтбокс с группой этого документа
      openLightbox(urls, baseTitle, 0);
    });
  });
}

// Запускаем инициализацию
initCertificates();

// Обработчики событий лайтбокса
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Клавиатурная навигация
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    showPrev();
  } else if (e.key === 'ArrowRight') {
    showNext();
  }
});

  // ===== ПОДПИСКА В ФУТЕРЕ =====
  const subscribeForm = document.querySelector('.subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (email) {
        alert(`Спасибо! Подписка на ${email} оформлена (демо-режим).`);
        this.reset();
      } else {
        alert('Введите email');
      }
    });
  }

  // ===== АВТООБНОВЛЕНИЕ ГОДА В КОПИРАЙТЕ =====
  const yearSpan = document.querySelector('.footer-copyright');
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2026', currentYear);
  }

  // ===== ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ =====
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  sections.forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });

  // ===== МАСКА ТЕЛЕФОНА =====
  if (typeof Inputmask !== 'undefined') {
    Inputmask({ mask: "+7 (999) 999-99-99" }).mask("#phone, #bookingPhone");
  }

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  console.log('Сайт успешно загружен!');
  handleHeaderScroll();
  toggleScrollTopButton();
});