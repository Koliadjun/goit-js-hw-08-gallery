import * as source from './gallery-items.js';

const refs = {
    galleryEl: document.querySelector('.js-gallery'),
    lightboxEl: document.querySelector('.js-lightbox'),
};

function createGalleryItemMarkup(array) {
    return array.map(el =>
        `<li class="gallery__item">
        <a class="gallery__link" href="${el.original}">
                <img
                class="gallery__image"
                src="${el.preview}"
                data-source="${el.original}"
                alt="${el.description}"
                />
            </a>
            </li>`).join('').trim();
};

refs.galleryEl.innerHTML = createGalleryItemMarkup(source.default);