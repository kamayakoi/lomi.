(function () {
    window.onload = init;

    function init() {
        var main = document.querySelector('main');
        var card = document.querySelector('.card-perspective > div');
        var bodyItem = document.querySelectorAll('.body-item');
        var goBack = document.querySelector('.go-back');

        card.onclick = function () {
            card.className = 'card card-inplace';
            //bodyItem[1].style.fontSize = '1.5rem';
            main.style.backgroundColor = 'rgba(34,41,67,0.75)';
        }

        goBack.onclick = function () {
            card.className = 'card';
            //bodyItem[1].style.fontSize = '1rem';
            main.style.backgroundColor = 'rgba(74,81,107,0.25)';
        }
    }
})();