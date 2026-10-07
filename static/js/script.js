console.log(
    '%cCopyright 2024 zyyo.net',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);

function handlePress() {
    this.classList.add('pressed');
}

function handleRelease() {
    this.classList.remove('pressed');
}

function handleCancel() {
    this.classList.remove('pressed');
}

function toggleClass(selector, className) {
    document.querySelectorAll(selector).forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector('.tc-img');
    if (tcMainElement && imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass('.tc-main', 'active');
    toggleClass('.tc', 'active');
}

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.projectItem').forEach(function (button) {
        button.addEventListener('mousedown', handlePress);
        button.addEventListener('mouseup', handleRelease);
        button.addEventListener('mouseleave', handleCancel);
        button.addEventListener('touchstart', handlePress, { passive: true });
        button.addEventListener('touchend', handleRelease);
        button.addEventListener('touchcancel', handleCancel);
    });

    var tc = document.querySelector('.tc');
    var tcMain = document.querySelector('.tc-main');
    if (tc) {
        tc.addEventListener('click', function () {
            pop();
        });
    }
    if (tcMain) {
        tcMain.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    var html = document.documentElement;
    var themeState = getCookie('themeState') || 'Light';
    var tanChiShe = document.getElementById('tanChiShe');
    var checkbox = document.getElementById('myonoffswitch');

    function changeTheme(theme) {
        html.dataset.theme = theme;
        setCookie('themeState', theme, 365);
        themeState = theme;
    }

    if (checkbox) {
        checkbox.addEventListener('change', function () {
            changeTheme(themeState === 'Dark' ? 'Light' : 'Dark');
        });
        checkbox.checked = themeState !== 'Dark';
    }

    changeTheme(themeState);

    if (window.location.search.includes('debug=fps')) {
        var fpsElement = document.createElement('div');
        fpsElement.id = 'fps';
        fpsElement.style.zIndex = '10000';
        fpsElement.style.position = 'fixed';
        fpsElement.style.left = '0';
        fpsElement.style.top = '0';
        document.body.insertBefore(fpsElement, document.body.firstChild);

        var fps = 0;
        var last = Date.now();
        function step() {
            var now = Date.now();
            fps += 1;
            if (now - last >= 1000) {
                fpsElement.textContent = 'FPS: ' + fps;
                fps = 0;
                last = now;
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
});

window.addEventListener('load', function () {
    var pageLoading = document.querySelector('#zyyo-loading');
    if (!pageLoading) {
        return;
    }

    setTimeout(function () {
        pageLoading.style.opacity = '0';
        pageLoading.style.visibility = 'hidden';
    }, 100);
});
