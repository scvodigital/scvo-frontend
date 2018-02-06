document.addEventListener('DOMContentLoaded', function() {
    var swiper = new Swiper(
        '.swiper-container',
        {
            effect: 'fade',
            speed: 900,
            grabCursor: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            centeredSlides: true,
            slidesPerView: 'auto',
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
            },
        }
    );
});
