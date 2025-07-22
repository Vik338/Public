// NFT данные для демонстрации
const nftData = [
    {
        id: 5184,
        name: "Tally #5184",
        price: 22.86,
        lastSale: 21.3,
        emoji: "😈",
        rarity: 4321,
        background: "linear-gradient(135deg, #ff6b6b, #ee5a24)"
    },
    {
        id: 3836,
        name: "Tally #3836",
        price: 22.86,
        lastSale: 21.3,
        emoji: "🤠",
        rarity: 2156,
        background: "linear-gradient(135deg, #4834d4, #686de0)"
    },
    {
        id: 4870,
        name: "Tally #4870",
        price: 22.86,
        lastSale: 18,
        emoji: "😬",
        rarity: 3890,
        background: "linear-gradient(135deg, #00d2d3, #54a0ff)"
    },
    {
        id: 2969,
        name: "Tally #2969",
        price: 22.86,
        lastSale: 19,
        emoji: "😎",
        rarity: 1245,
        background: "linear-gradient(135deg, #5f27cd, #341f97)"
    },
    {
        id: 1750,
        name: "Tally #1750",
        price: 22.87,
        lastSale: 17.52,
        emoji: "😄",
        rarity: 892,
        background: "linear-gradient(135deg, #00d2d3, #54a0ff)"
    },
    {
        id: 4976,
        name: "Tally #4976",
        price: 22.88,
        lastSale: 18.52,
        emoji: "😃",
        rarity: 4521,
        background: "linear-gradient(135deg, #a55eea, #26de81)"
    },
    {
        id: 5291,
        name: "Tally #5291",
        price: 22.9,
        lastSale: 21.3,
        emoji: "🤔",
        rarity: 1500,
        background: "linear-gradient(135deg, #fd79a8, #fdcb6e)"
    },
    {
        id: 778,
        name: "Tally #778",
        price: 22.93,
        lastSale: 60.77,
        emoji: "🥰",
        rarity: 2596,
        background: "linear-gradient(135deg, #6c5ce7, #a29bfe)"
    },
    {
        id: 3722,
        name: "Tally #3722",
        price: 23.19,
        lastSale: 17.5,
        emoji: "🤪",
        rarity: 3390,
        background: "linear-gradient(135deg, #00cec9, #55a3ff)"
    },
    {
        id: 5528,
        name: "Tally #5528",
        price: 23.45,
        lastSale: 52.66,
        emoji: "😱",
        rarity: 3743,
        background: "linear-gradient(135deg, #fd79a8, #e84393)"
    },
    {
        id: 4206,
        name: "Tally #4206",
        price: 23.71,
        lastSale: 16.1,
        emoji: "🤓",
        rarity: 3455,
        background: "linear-gradient(135deg, #00b894, #00cec9)"
    },
    {
        id: 5852,
        name: "Tally #5852",
        price: 23.76,
        lastSale: 19.11,
        emoji: "🔥",
        rarity: 4473,
        background: "linear-gradient(135deg, #e17055, #d63031)"
    }
];

// Звуковые эффекты
const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let frequency;
    
    switch(type) {
        case 'hover':
            frequency = 800;
            break;
        case 'click':
            frequency = 1000;
            break;
        case 'buy':
            frequency = 1200;
            break;
        default:
            frequency = 600;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
};

// Генерация NFT карточек
function generateNFTCards() {
    const grid = document.getElementById('nftGrid');
    grid.innerHTML = '';
    
    nftData.forEach((nft, index) => {
        const card = document.createElement('div');
        card.className = 'nft-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="nft-image" style="background: ${nft.background}">
                <span style="font-size: 60px;">${nft.emoji}</span>
                <div class="rarity-badge">#${nft.rarity}</div>
            </div>
            <div class="nft-info">
                <div class="nft-title">${nft.name}</div>
                <div class="nft-price">◊ ${nft.price}</div>
                <div class="nft-last-sale">Last: ◊ ${nft.lastSale}</div>
            </div>
        `;
        
        // Добавляем обработчики событий
        card.addEventListener('mouseenter', () => {
            playSound('hover');
            card.style.transform = 'translateY(-8px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', () => {
            playSound('click');
            openModal(nft);
        });
        
        grid.appendChild(card);
    });
    
    // Анимация появления карточек
    const cards = grid.querySelectorAll('.nft-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Модальное окно
function openModal(nft) {
    const modal = document.getElementById('nftModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    
    // Создаем изображение для модального окна
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Создаем градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    const colors = nft.background.match(/rgb\([^)]+\)|#[a-fA-F0-9]{6}/g) || ['#667eea', '#764ba2'];
    gradient.addColorStop(0, colors[0] || '#667eea');
    gradient.addColorStop(1, colors[1] || '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    // Добавляем эмодзи
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(nft.emoji, 200, 250);
    
    modalImage.src = canvas.toDataURL();
    modalTitle.textContent = nft.name;
    modalPrice.innerHTML = `
        <div style="font-size: 24px; color: var(--accent-blue); margin-bottom: 10px;">◊ ${nft.price}</div>
        <div style="font-size: 14px; color: var(--text-secondary);">Last Sale: ◊ ${nft.lastSale}</div>
        <div style="font-size: 14px; color: var(--text-secondary);">Rarity: #${nft.rarity}</div>
    `;
    
    modal.style.display = 'block';
    
    // Анимация появления
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transition = 'all 0.3s ease';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
    }, 10);
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('nftModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Анимация статистики в хедере
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const originalText = stat.textContent;
        const hasNumber = originalText.match(/[\d.]+/);
        
        if (hasNumber) {
            const number = parseFloat(hasNumber[0]);
            const prefix = originalText.split(hasNumber[0])[0];
            const suffix = originalText.split(hasNumber[0])[1];
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                stat.textContent = prefix + current.toFixed(hasNumber[0].includes('.') ? 3 : 0) + suffix;
            }, 30);
        }
    });
}

// Фильтрация и сортировка
function setupFilters() {
    const sortSelect = document.querySelector('.sort-select');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    sortSelect.addEventListener('change', (e) => {
        const sortType = e.target.value;
        sortNFTs(sortType);
    });
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viewButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const view = e.target.dataset.view;
            changeView(view);
        });
    });
}

function sortNFTs(sortType) {
    let sortedData = [...nftData];
    
    switch(sortType) {
        case 'Price ↑':
            sortedData.sort((a, b) => a.price - b.price);
            break;
        case 'Price ↓':
            sortedData.sort((a, b) => b.price - a.price);
            break;
        case 'Recently Listed':
            sortedData.sort(() => Math.random() - 0.5);
            break;
        default:
            break;
    }
    
    // Обновляем данные и перегенерируем карточки
    nftData.length = 0;
    nftData.push(...sortedData);
    generateNFTCards();
}

function changeView(view) {
    const grid = document.getElementById('nftGrid');
    
    switch(view) {
        case 'list':
            grid.style.gridTemplateColumns = '1fr';
            grid.querySelectorAll('.nft-card').forEach(card => {
                card.style.display = 'flex';
                card.style.alignItems = 'center';
                const img = card.querySelector('.nft-image');
                img.style.width = '80px';
                img.style.height = '80px';
                img.style.fontSize = '30px';
            });
            break;
        case 'large':
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            grid.querySelectorAll('.nft-card').forEach(card => {
                card.style.display = 'block';
                const img = card.querySelector('.nft-image');
                img.style.width = '100%';
                img.style.height = '300px';
                img.style.fontSize = '80px';
            });
            break;
        default: // grid
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            grid.querySelectorAll('.nft-card').forEach(card => {
                card.style.display = 'block';
                const img = card.querySelector('.nft-image');
                img.style.width = '100%';
                img.style.height = '200px';
                img.style.fontSize = '60px';
            });
            break;
    }
}

// Анимация активности
function animateActivity() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Добавляем новые активности периодически
function addRandomActivity() {
    const activityFeed = document.querySelector('.activity-feed');
    const activities = [
        { type: '💰 Sale', price: '◊ 25.5', time: 'just now' },
        { type: '📝 List', price: '◊ 30.0', time: '1 min ago' },
        { type: '🔥 Bid', price: '◊ 20.1', time: '2 min ago' },
        { type: '⚡ Transfer', price: '◊ 0.0', time: '3 min ago' }
    ];
    
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const newItem = document.createElement('div');
        newItem.className = 'activity-item';
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateX(50px)';
        
        newItem.innerHTML = `
            <div class="activity-avatar">🐸</div>
            <div class="activity-details">
                <div class="activity-type">${randomActivity.type}</div>
                <div class="activity-time">${randomActivity.time}</div>
                <div class="activity-price">${randomActivity.price}</div>
            </div>
        `;
        
        activityFeed.appendChild(newItem);
        
        // Анимация появления
        setTimeout(() => {
            newItem.style.transition = 'all 0.5s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateX(0)';
        }, 100);
        
        // Удаляем старые элементы
        const items = activityFeed.querySelectorAll('.activity-item');
        if (items.length > 10) {
            items[1].remove(); // Оставляем заголовок
        }
    }, 5000);
}

// Обработчики кнопок
function setupButtons() {
    // Кнопки покупки
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn') || e.target.classList.contains('sell-now-btn')) {
            playSound('buy');
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 150);
        }
    });
    
    // Закрытие модального окна
    document.querySelector('.close').addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('nftModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Эффекты при прокрутке
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            header.style.background = 'rgba(22, 27, 34, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.background = 'rgba(22, 27, 34, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    generateNFTCards();
    animateStats();
    setupFilters();
    animateActivity();
    addRandomActivity();
    setupButtons();
    setupScrollEffects();
    
    // Добавляем класс загрузки и убираем его через секунду
    document.body.classList.add('loading');
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
});

// Экспорт для использования в других файлах
window.NFTMarketplace = {
    generateNFTCards,
    openModal,
    closeModal,
    playSound
};
