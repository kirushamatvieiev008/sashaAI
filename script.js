/**
 * Стан додатку та початкова база даних товарів
 */
const products = [
  { id: 1, name: "Гала Серце", variety: "Гала", shape: "серце", size: "великий", price: 65, icon: "🍎" },
  { id: 2, name: "Голден Куб", variety: "Голден Делішес", shape: "куб", size: "преміум", price: 80, icon: "🍏" },
  { id: 3, name: "Семеренко Зірка", variety: "Ренет Семеренко", shape: "зірка", size: "середній", price: 70, icon: "🍏" },
  { id: 4, name: "Фуджі Класик", variety: "Фуджі", shape: "стандартна", size: "великий", price: 45, icon: "🍎" },
  { id: 5, name: "Чемпіон Серце", variety: "Чемпіон", shape: "серце", size: "преміум", price: 85, icon: "🍎" },
  { id: 6, name: "Голден Стандарт", variety: "Голден Делішес", shape: "стандартна", size: "середній", price: 40, icon: "🍏" }
];

let selectedProduct = null;

// DOM Елементи
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const shapeFilter = document.getElementById('shapeFilter');
const sizeFilter = document.getElementById('sizeFilter');
const varietyFilter = document.getElementById('varietyFilter');

// Елементи модального вікна
const orderModal = document.getElementById('orderModal');
const closeModalBtn = document.getElementById('closeModal');
const orderForm = document.getElementById('orderForm');
const weightInput = document.getElementById('weightInput');

/**
 * Ініціалізація додатку
 */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  setupEventListeners();
});

/**
 * Рендеринг списку товарів
 */
function renderProducts(items) {
  productsGrid.innerHTML = '';

  if (items.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">За вашим запитом яблук не знайдено.</p>`;
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        ${product.icon}
        <span class="shape-badge">Форма: ${product.shape}</span>
      </div>
      <div class="product-body">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-meta">Сорт: ${product.variety} • Розмір: ${product.size}</p>
        <div class="product-price">${product.price} грн / кг</div>
        <button class="btn btn-primary btn-block" onclick="openOrderModal(${product.id})">Замовити</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

/**
 * Логіка фільтрації
 */
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  const shape = shapeFilter.value;
  const size = sizeFilter.value;
  const variety = varietyFilter.value;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query) || p.variety.toLowerCase().includes(query);
    const matchesShape = shape === 'all' || p.shape === shape;
    const matchesSize = size === 'all' || p.size === size;
    const matchesVariety = variety === 'all' || p.variety === variety;

    return matchesSearch && matchesShape && matchesSize && matchesVariety;
  });

  renderProducts(filtered);
}

/**
 * Модальне вікно та розрахунок знижки
 */
window.openOrderModal = function(productId) {
  selectedProduct = products.find(p => p.id === productId);
  if (!selectedProduct) return;

  document.getElementById('productId').value = selectedProduct.id;
  document.getElementById('modalProductTitle').innerText = `Замовлення: ${selectedProduct.name}`;
  document.getElementById('modalProductSubtitle').innerText = `Ціна: ${selectedProduct.price} грн/кг`;

  weightInput.value = 1;
  calculatePrice();
  orderModal.classList.remove('hidden');
};

function calculatePrice() {
  if (!selectedProduct) return;

  const weight = parseInt(weightInput.value) || 1;
  const basePrice = selectedProduct.price * weight;

  // ДИНАМІЧНА ЗНИЖКА: Від 5 кг кожний кг додає +3%
  let discountPercent = 0;
  if (weight >= 5) {
    discountPercent = (weight - 4) * 3;
    // Обмеження максимальної знижки (наприклад, 40%)
    if (discountPercent > 40) discountPercent = 40;
  }

  const discountAmount = (basePrice * discountPercent) / 100;
  const finalPrice = basePrice - discountAmount;

  document.getElementById('basePriceCalc').innerText = `${basePrice} грн`;
  document.getElementById('discountPercent').innerText = `${discountPercent}%`;
  document.getElementById('discountAmount').innerText = `-${discountAmount.toFixed(0)} грн`;
  document.getElementById('finalTotalPrice').innerText = `${finalPrice.toFixed(0)} грн`;
}

/**
 * Події та слухачі
 */
function setupEventListeners() {
  searchInput.addEventListener('input', filterProducts);
  shapeFilter.addEventListener('change', filterProducts);
  sizeFilter.addEventListener('change', filterProducts);
  varietyFilter.addEventListener('change', filterProducts);

  weightInput.addEventListener('input', calculatePrice);

  closeModalBtn.addEventListener('click', () => {
    orderModal.classList.add('hidden');
  });

  // Аккордеон FAQ
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });

  // Відправка форми
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Дякуємо, ${document.getElementById('firstName').value}! Ваше замовлення успішно прийнято. Менеджер зателефонує вам найближчим часом.`);
    orderModal.classList.add('hidden');
    orderForm.reset();
  });
}