import { register } from "swiper/element/bundle";

register();

const swiperEl = document.querySelector("swiper-container");
Object.assign(swiperEl, {
  slidesPerView: "auto",
  a11y: true,
  navigation: {
    nextEl: ".swiper__nav-button-next",
    prevEl: ".swiper__nav-button-prev",
  },
  spaceBetween: 16,
  slidesOffsetBefore: 16,
  slidesOffsetAfter: 16,
  scrollbar: {
    hide: false,
    draggable: true,
  },
  breakpoints: {
    1280: {
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1536: {
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      slidesPerView: 4,
      spaceBetween: 24,
    },
    2560: {
      slidesPerView: 5,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      spaceBetween: 24,
    },
  },
  injectStyles: [
    `
    :host .swiper-wrapper {
      padding-bottom: 2rem;
    }
    
    :host ::slotted(swiper-slide) {
      width: auto;
    }
    
    @media screen and (min-width: 1536px) {
      :host .swiper-wrapper {
        padding-bottom: 4rem;
      }
    }
  `,
  ],
  on: {
    afterInit: () => {
      const buttons = swiperEl.querySelectorAll(".swiper__nav-button");
      buttons.forEach((button) => {
        button.removeAttribute("aria-controls");
      });
    },
  },
});
swiperEl.initialize();
