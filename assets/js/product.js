// Product card creation function (modified)
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    product.images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${product.product_name} - Image ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        carousel.appendChild(img);
    });

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';

    const productName = document.createElement('h2');
    productName.className = 'product-name';
    productName.textContent = product.product_name;

    const readMore = document.createElement('a');
    readMore.href = `product-details.html?code=${product.product_code}`;
    readMore.className = 'read-more';
    readMore.textContent = 'Read More';

    productInfo.appendChild(productName);
    productInfo.appendChild(readMore);

    card.appendChild(carousel);
    card.appendChild(productInfo);

    return card;
}

// Function to setup carousel functionality with auto-rotation
function setupCarousel(card) {
    const images = card.querySelectorAll('.carousel img');
    let currentIndex = 0;

    function showImage(index) {
        images[currentIndex].classList.remove('active');
        currentIndex = (index + images.length) % images.length;
        images[currentIndex].classList.add('active');
    }

    // Auto-rotate images every 2 seconds
    setInterval(() => showImage(currentIndex + 1), 5000);
}

// Function to create all product cards
function createProductCards(products) {
    const container = document.getElementById('product-container');
    products.forEach(product => {
        const card = createProductCard(product);
        setupCarousel(card);
        container.appendChild(card);
    });
}

// Fetch JSON data and create product cards
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            createProductCards(data.products);
        })
        .catch(error => {
            console.error('Error loading the product data:', error);
        });
});

// Product details page functionality
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.product_code === productCode);
            if (product) {
                displayProductDetails(product);
            } else {
                console.error('Product not found');
            }
        })
        .catch(error => {
            console.error('Error loading the product data:', error);
        });
}

function displayProductDetails(product) {
    document.getElementById('product-name').textContent = product.product_name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;

    const colorSelector = document.getElementById('color-selector');
    product.colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelector.appendChild(option);
    });

    const sizeSelector = document.getElementById('size-selector');
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelector.appendChild(option);
    });

    const carousel = document.getElementById('product-carousel');
    product.images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${product.product_name} - Image ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        carousel.appendChild(img);
    });

    setupCarousel(document.querySelector('.product-details'));
}

// Check if we're on the product details page
if (document.querySelector('.product-details')) {
    loadProductDetails();
}



//product detail page 

