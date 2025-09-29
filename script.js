// --- Xử lý menu mobile ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const overlay = document.getElementById('overlay');

    if (menuToggle && mainMenu && overlay) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('is-open');
            overlay.classList.toggle('is-open');
            menuToggle.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            mainMenu.classList.remove('is-open');
            overlay.classList.remove('is-open');
            menuToggle.classList.remove('active');
        });

        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainMenu.classList.remove('is-open');
                    overlay.classList.remove('is-open');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }
});

// --- SLIDER NGẪU NHIÊN HIỆU ỨNG ---
function initializeSlider() {
    const imageElements = document.querySelectorAll('.main-image');
    const dots = document.querySelectorAll('.dot');
    let currentImageIndex = 0;
    let isAnimating = false;

    const effects = ["fade", "slide", "zoom", "flip"];

    function applyEffect(oldImg, newImg, effect) {
        return new Promise(resolve => {
            oldImg.classList.remove("active", "fade", "slide", "zoom", "flip");
            newImg.classList.remove("active", "fade", "slide", "zoom", "flip");

            newImg.style.display = "block"; // đảm bảo hiển thị
            newImg.offsetWidth; // trigger reflow để CSS transition chạy

            switch (effect) {
                case "fade":
                    oldImg.classList.add("fade-out");
                    newImg.classList.add("fade-in");
                    break;
                case "slide":
                    oldImg.classList.add("slide-out");
                    newImg.classList.add("slide-in");
                    break;
                case "zoom":
                    oldImg.classList.add("zoom-out");
                    newImg.classList.add("zoom-in");
                    break;
                case "flip":
                    oldImg.classList.add("flip-out");
                    newImg.classList.add("flip-in");
                    break;
            }

            setTimeout(() => {
                oldImg.style.display = "none";
                oldImg.classList.remove("fade-out", "slide-out", "zoom-out", "flip-out");
                newImg.classList.remove("fade-in", "slide-in", "zoom-in", "flip-in");
                newImg.classList.add("active");
                resolve();
            }, 600); // thời gian khớp với CSS transition
        });
    }

    function showImage(index) {
        if (isAnimating || index === currentImageIndex) return;
        isAnimating = true;
        const oldImg = imageElements[currentImageIndex];
        const newImg = imageElements[index];
        const effect = effects[Math.floor(Math.random() * effects.length)];

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        applyEffect(oldImg, newImg, effect).then(() => {
            currentImageIndex = index;
            isAnimating = false;
        });
    }

    function changeImage(direction = 1) {
        const nextIndex = (currentImageIndex + direction + imageElements.length) % imageElements.length;
        showImage(nextIndex);
    }

    document.querySelector('.prev').onclick = () => changeImage(-1);
    document.querySelector('.next').onclick = () => changeImage(1);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showImage(index);
        });
    });

    imageElements.forEach((img, i) => {
        img.style.display = i === 0 ? "block" : "none";
    });

    setInterval(() => changeImage(1), 5000);
}

// --- Hiệu ứng Ripple menu ---
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        this.appendChild(ripple);
        let x = e.clientX - this.getBoundingClientRect().left;
        let y = e.clientY - this.getBoundingClientRect().top;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        setTimeout(() => ripple.remove(), 600);
    });
});

// --- Thống kê ---
function updateStatistics() {
    let todayVisits = 125;
    let totalVisits = 15342;
    let onlineUsers = 8;
    let weeklyVisits = 892;

    if (typeof gtag === 'function') {
        const stats = JSON.parse(localStorage.getItem('visitStats')) || {
            today: 125, total: 15342, online: 8, weekly: 892
        };
        stats.today++; stats.total++; stats.weekly++;
        localStorage.setItem('visitStats', JSON.stringify(stats));
        todayVisits = stats.today; totalVisits = stats.total;
        onlineUsers = stats.online; weeklyVisits = stats.weekly;
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }

    const statsElements = document.querySelectorAll('.statistics p');
    if (statsElements.length >= 4) {
        statsElements[0].textContent = `Lượt truy cập hôm nay: ${todayVisits}`;
        statsElements[1].textContent = `Tổng số lượt truy cập: ${totalVisits.toLocaleString('vi-VN')}`;
        statsElements[2].textContent = `Người đang online: ${onlineUsers}`;
        statsElements[3].textContent = `Lượt truy cập tuần này: ${weeklyVisits}`;
    }
}

window.addEventListener('resize', () => {
    const mainMenu = document.getElementById('main-menu');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    if (window.innerWidth > 768) {
        if (mainMenu) mainMenu.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const overlay = document.getElementById('overlay');
                if (overlay && overlay.classList.contains('is-open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });
    const overlay = document.getElementById('overlay');
    if (overlay) observer.observe(overlay, { attributes: true });
});

document.addEventListener('DOMContentLoaded', updateStatistics);
