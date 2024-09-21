// Fetch data from data.json and initialize the product list
function initProductList() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const productListEl = document.getElementById('product-list');
            if (productListEl) {
                productListEl.className = 'product-grid';
                data.products.forEach(product => {
                    productListEl.appendChild(createProductCard(product));
                });
            }
        })
        .catch(error => {
            console.error('Error loading product data:', error);
        });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.images[0]}" alt="${product.product_name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.product_name}</h3>
            <a href="product-detail.html?code=${product.product_code}" class="read-more-btn">Read More</a>
        </div>
    `;
    return card;
}

// Function to show product details in product-detail.html
function showProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.product_code === productCode);
            const detailEl = document.getElementById('product-detail');
            if (detailEl) {
                detailEl.innerHTML = `
                <div class="unique-product-detail-container">
                        <div class="unique-image-gallery">
                            <img src="${product.images[0]}" alt="${product.product_name}" class="unique-detail-image">
                            <div class="unique-thumbnail-images">
                                ${product.images.map(img => `<img src="${img}" alt="${product.product_name}" class="unique-thumbnail">`).join('')}
                            </div>
                        </div>
                        <div class="unique-product-info">
                            <h2 class="unique-product-name">${product.product_name}</h2>
                            <div class="unique-features">
                                <h3>Features</h3>
                                <ul>
                                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="unique-technical-features">
                                <h3>Technical Features</h3>
                                <ul>
                                    ${product.technical_features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="unique-actions">
                                <a href="${product.pdf_manual}" target="_blank" class="unique-download-btn">Download PDF Manual</a>
                            </div>
                        </div>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
        });
}

// Initialize the correct function based on the page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-list')) {
        initProductList(); // Called on product.html
    } else if (document.getElementById('product-detail')) {
        showProductDetail(); // Called on product-detail.html
    }
});