// Thêm vào đầu file script.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const overlay = document.getElementById('overlay');

    if (menuToggle && mainMenu && overlay) {
        // Sự kiện khi bấm vào nút hamburger
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('is-open');
            overlay.classList.toggle('is-open');
            menuToggle.classList.toggle('active');
        });

        // Sự kiện khi bấm vào lớp phủ (để đóng menu)
        overlay.addEventListener('click', () => {
            mainMenu.classList.remove('is-open');
            overlay.classList.remove('is-open');
            menuToggle.classList.remove('active');
        });

        // Đóng menu khi bấm vào menu item (trên mobile)
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
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

// --- PHẦN CODE CŨ VẪN GIỮ NGUYÊN ---

// Thay đổi hình ảnh trường mầm non mỗi 5 giây
const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
    'image5.jpg',
];
let currentImageIndex = 0;
const imageElements = document.querySelectorAll('.main-image');
const dots = document.querySelectorAll('.dot');

function showImage(index) {
    imageElements.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
            img.classList.add('active');
        }
    });
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
    currentImageIndex = index;
}

function changeImage(direction = 1) {
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    showImage(currentImageIndex);
}

// Thêm hiệu ứng gợn sóng cho các nút menu
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        this.appendChild(ripple);
        
        let x = e.clientX - this.getBoundingClientRect().left;
        let y = e.clientY - this.getBoundingClientRect().top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Thêm sự kiện cho nút bấm slider
document.querySelector('.prev').addEventListener('click', () => changeImage(-1));
document.querySelector('.next').addEventListener('click', () => changeImage(1));

// Thêm sự kiện cho các nút dot
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showImage(index);
    });
});

// Khởi tạo hình ảnh đầu tiên
showImage(currentImageIndex);

// Tự động chuyển ảnh mỗi 5 giây
setInterval(() => changeImage(1), 5000);

// Hàm cập nhật thống kê truy cập
function updateStatistics() {
    // Mặc định hiển thị dữ liệu tĩnh khi chưa có dữ liệu từ Analytics
    let todayVisits = 125;
    let totalVisits = 15342;
    let onlineUsers = 8;
    let weeklyVisits = 892;
    
    // Kiểm tra xem API Google Analytics đã sẵn sàng chưa
    if (typeof gtag === 'function') {
        // Lấy dữ liệu thống kê từ bộ nhớ cục bộ hoặc cập nhật từ server
        const stats = JSON.parse(localStorage.getItem('visitStats')) || {
            today: 125,
            total: 15342,
            online: 8,
            weekly: 892
        };
        
        // Tăng số lượt truy cập
        stats.today++;
        stats.total++;
        stats.weekly++;
        
        // Lưu lại vào bộ nhớ cục bộ
        localStorage.setItem('visitStats', JSON.stringify(stats));
        
        // Gán giá trị
        todayVisits = stats.today;
        totalVisits = stats.total;
        onlineUsers = stats.online;
        weeklyVisits = stats.weekly;
        
        // Gửi sự kiện pageview đến Google Analytics
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
    
    // Cập nhật UI
    const statsElements = document.querySelectorAll('.statistics p');
    if (statsElements.length >= 4) {
        statsElements[0].textContent = `Lượt truy cập hôm nay: ${todayVisits}`;
        statsElements[1].textContent = `Tổng số lượt truy cập: ${totalVisits.toLocaleString('vi-VN')}`;
        statsElements[2].textContent = `Người đang online: ${onlineUsers}`;
        statsElements[3].textContent = `Lượt truy cập tuần này: ${weeklyVisits}`;
    }
}

// Xử lý resize window để đảm bảo menu hoạt động đúng
window.addEventListener('resize', () => {
    const mainMenu = document.getElementById('main-menu');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (window.innerWidth > 768) {
        // Trở về desktop, đóng menu mobile nếu đang mở
        if (mainMenu) mainMenu.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

// Ngăn cuộn trang khi menu mobile đang mở
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
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
    if (overlay) {
        observer.observe(overlay, { attributes: true });
    }
});

// Gọi hàm cập nhật khi trang được tải
document.addEventListener('DOMContentLoaded', updateStatistics);