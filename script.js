import * as source from './gallery-items.js';
let data;
const urlImg = 'https://pixabay.com/api/?key=21859893-eed1f1d786560e2667ad1f26b&&image_type=photo&pretty=true&per_page=200';

if (self.fetch) {
    let response = await fetch(urlImg);
    if (response.ok) {
        data = await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
} else {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', urlImg,);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        data = xhr.response;
    };
}
let currentImgSourceUrl = '';
let inputData = [];
const refs = {
    galleryEl: document.querySelector('.js-gallery'),
    lightboxEl: document.querySelector('.js-lightbox'),
    lightboxButtonEl: document.querySelector('button[data-action="close-lightbox"]'),
    lightboxImageEl: document.querySelector('.lightbox__image'),
    input: document.querySelector('.more-image'),
    divFixed: document.querySelector('.fixed'),
};

const ACTION = {
    close: 'close',
    open: 'open',
};
function createGalleryItemsMarkup(array) {
    return array.map(el =>
        `<li class="gallery__item">
        <a class="gallery__link" href="${el.original}">
                <img
                loading="lazy"
                class="gallery__image lazyload"
                data-src="${el.preview}"
                data-source="${el.original}"
                alt="${el.description}"
                />
            </a>
            </li>`).join('');
}

function setLightBoxImageSrcAttribute(url) {
    refs.lightboxImageEl.setAttribute('src', url);

}
function modalOpenClose(action) {
    if (action === ACTION.open) {
        refs.lightboxEl.classList.add('is-open');
        refs.divFixed.classList.add('is-close')
        setLightBoxImageSrcAttribute(currentImgSourceUrl);
    }
    if (action === ACTION.close) {
        refs.lightboxEl.classList.remove('is-open');
        refs.divFixed.classList.remove('is-close')
        currentImgSourceUrl = '';
        setLightBoxImageSrcAttribute(currentImgSourceUrl);
    }
}
function nextImgUrl(url) {
    const currentIndex = inputData.map((e) => e.original).indexOf(url);
    let nextIndex;
    if (currentIndex === inputData.length - 1) {
        nextIndex = 0;
    } else { nextIndex = currentIndex + 1; }

    currentImgSourceUrl = inputData[nextIndex].original;
    return currentImgSourceUrl;
}
function prevImgUrl(url) {
    const currentIndex = inputData.map((e) => e.original).indexOf(url);
    let prevIndex;
    if (currentIndex === 0) {
        prevIndex = inputData.length - 1;
    } else { prevIndex = currentIndex - 1; }

    currentImgSourceUrl = inputData[prevIndex].original;
    return currentImgSourceUrl;
}
function pixabayCovertData(data) {
    const outputData = data.hits.map((el) => {
        return {
            preview: el.webformatURL,
            original: el.largeImageURL,
            description: el.user
        };
    });
    return outputData;
}
function lazyLoadSupport() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Dynamically import the LazySizes library
        const script = document.createElement('script');
        script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

refs.lightboxImageEl.addEventListener('touchstart', handleTouchStart, false);
refs.lightboxImageEl.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            setLightBoxImageSrcAttribute(nextImgUrl(currentImgSourceUrl));
        } else {
            setLightBoxImageSrcAttribute(prevImgUrl(currentImgSourceUrl));
        }
    } else {
        if (yDiff > 0) {
            modalOpenClose(ACTION.close);
        } else {
            /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
}

if (refs.input.checked) {
    inputData = pixabayCovertData(data);
} else { inputData = source.default; }
refs.galleryEl.innerHTML = createGalleryItemsMarkup(inputData);
lazyLoadSupport();
refs.input.addEventListener('input', () => {
    if (refs.input.checked) {
        inputData = pixabayCovertData(data);
    } else {
        inputData = source.default;
    }
    refs.galleryEl.innerHTML = createGalleryItemsMarkup(inputData);
    lazyLoadSupport();
})

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


