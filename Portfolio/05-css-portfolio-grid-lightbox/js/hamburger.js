// console.log("i'm here")

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

const handleScrollNav = () => {
    if (window.scrollY > 40) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleScrollNav);
handleScrollNav();