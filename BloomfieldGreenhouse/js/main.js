const logoLink = document.getElementById('logo-link');

logoLink.addEventListener('click', function(){
    window.scroll(0, 0);
});

logoLink.addEventListener('keypress', function(e){
    if (e.keyCode === 13){
        window.scroll(0, 0);
    }
});