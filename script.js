import * as source from './gallery-items.js';
let currentImgSourceUrl = '';
const refs = {
    galleryEl: document.querySelector('.js-gallery'),
    lightboxEl: document.querySelector('.js-lightbox'),
    lightboxButtonEl: document.querySelector('button[data-action="close-lightbox"]'),
    lightboxImageEl: document.querySelector('.lightbox__image'),
};
const ACTION = {
    close: 'close',
    open: 'open',
}
function createGalleryItemsMarkup(array) {
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
            </li>`).join('');
};
function setLightBoxImageSrcAttribute(url) {
    refs.lightboxImageEl.setAttribute('src', url);

}
function modalOpenClose(action) {
    if (action === ACTION.open) {
        refs.lightboxEl.classList.add('is-open');
        setLightBoxImageSrcAttribute(currentImgSourceUrl);
    }
    if (action === ACTION.close) {
        refs.lightboxEl.classList.remove('is-open');
        currentImgSourceUrl = '';
        setLightBoxImageSrcAttribute(currentImgSourceUrl);
    }
}
function nextImgUrl(url) {
    const currentIndex = source.default.map((e) => e.original).indexOf(url);
    let nextIndex;
    if (currentIndex === source.default.length - 1) {
        nextIndex = 0;
    } else { nextIndex = currentIndex + 1; }

    currentImgSourceUrl = source.default[nextIndex].original;
    return currentImgSourceUrl;
}
function prevImgUrl(url) {
    const currentIndex = source.default.map((e) => e.original).indexOf(url);
    let prevIndex;
    if (currentIndex === 0) {
        prevIndex = source.default.length - 1;
    } else { prevIndex = currentIndex - 1; }

    currentImgSourceUrl = source.default[prevIndex].original;
    return currentImgSourceUrl;
}

refs.galleryEl.innerHTML = createGalleryItemsMarkup(source.default);
refs.galleryEl.addEventListener('click', (e) => {
    e.preventDefault();
    currentImgSourceUrl = e.target.dataset.source;
    modalOpenClose(ACTION.open);
})
refs.lightboxEl.addEventListener('click', (e) => {
    if (!(e.target.dataset.action === 'close-lightbox')
        && !e.target.classList.contains('lightbox__overlay')) return;
    modalOpenClose(ACTION.close);
})
document.addEventListener('keyup', (e) => {
    if (refs.lightboxEl.classList.contains('is-open')) {
        if (e.key === 'Escape') {
            modalOpenClose(ACTION.close);
        }
        if (e.key === 'ArrowRight') {
            setLightBoxImageSrcAttribute(nextImgUrl(currentImgSourceUrl));

        }
        if (e.key === 'ArrowLeft') {
            setLightBoxImageSrcAttribute(prevImgUrl(currentImgSourceUrl));
        }
    }
})


