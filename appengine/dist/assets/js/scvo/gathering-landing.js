document.addEventListener('DOMContentLoaded', function() {
    var swiper = new Swiper(
        '.swiper-container',
        {
            effect: 'coverflow',
            grabCursor: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true,
            },
            pagination: {
                el: '.swiper-pagination',
            },
        }
    );
});
