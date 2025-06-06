import { register } from "swiper/element/bundle";

register();

const swiperEl = document.querySelector("swiper-container");
Object.assign(swiperEl, {
  slidesPerView: "auto",
  navigation: true,
  spaceBetween: 16,
  slidesOffsetBefore: 16,
  slidesOffsetAfter: 16,
  scrollbar: {
    hide: false,
    draggable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 4,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    2560: {
      slidesPerView: 5,
    },
  },
  injectStyles: [
    `
    :host .swiper-wrapper {
      padding-bottom: 2rem;
    }
    
    @media screen and (min-width: 1280px) {
      :host .swiper-wrapper {
        padding-bottom: 4rem;
      }
    }
  `,
  ],
});
swiperEl.initialize();
