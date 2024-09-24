// Fetch data from data.json and initialize the product list
function initProductList() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const productListEl = document.getElementById('product-list');
            if (productListEl) {
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
    card.className = 'col-lg-4';
    card.setAttribute('data-aos', 'zoom-in');
    card.setAttribute('data-aos-delay', '200');
    
    card.innerHTML = `
        <div class="service-item2 position-relative">
            <div class="img">
                <img src="${product.images[0]}" alt="${product.product_name}">
            </div>
            <div class="details2">
               <h3 class="product-name">${product.product_name}</h3>
               <a href="product-detail.html?code=${product.product_code}" class="read-more-btn">Read More</a>
            </div>
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
            if (detailEl && product) {
                detailEl.innerHTML = `
                    <div class="unique-product-detail-container row">
                        <div class="unique-image-gallery col-md-7">
                            <img src="${product.images[0]}" alt="${product.product_name}" class="unique-detail-image" id="main-image">
                            <div class="unique-thumbnail-images">
                                ${product.images.map((img, index) => `<img src="${img}" alt="${product.product_name}" class="unique-thumbnail" onclick="changeImage(${index})">`).join('')}
                            </div>
                        </div>
                        <div class="unique-product-info col-md-5">
                            <h1 class="unique-product-name">${product.product_name}</h1>
                            <div class="unique-features">
                               <h3>Features</h3>
                               <ul style="list-style: none;">
                                    ${product.features ? product.features.map(feature => `<li><i class="bi bi-check2-all"></i> <span>${feature}</span></li>`).join('') : 'No features available'}
                                </ul>
                            </div>
                            <div class="unique-technical-features">
                                <h3>Technical Features</h3>
                                <ul style="list-style: none;">
                                    ${product.technical_features ? product.technical_features.map(feature => `<li><i class="bi bi-check2-all"></i> <span>${feature}</span></li>`).join('') : 'No technical features available'}
                                </ul>
                            </div>
                            <div class="unique-actions">
                                ${product.pdf_manual ? `<a href="${product.pdf_manual}" target="_blank" class="unique-download-btn">Download PDF Manual</a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                startImageRotation(product.images);
            } else if (detailEl) {
                detailEl.innerHTML = '<p>Product not found</p>';
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
        });
}

let currentImageIndex = 0;
let intervalId;

function startImageRotation(images) {
    intervalId = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        document.getElementById('main-image').src = images[currentImageIndex];
    }, 3000);
}

function changeImage(index) {
    clearInterval(intervalId);
    currentImageIndex = index;
    document.getElementById('main-image').src = document.getElementsByClassName('unique-thumbnail')[index].src;
    startImageRotation(Array.from(document.getElementsByClassName('unique-thumbnail')).map(img => img.src));
}


// Initialize the correct function based on the page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-list')) {
        initProductList(); // Called on product.html
    } else if (document.getElementById('product-detail')) {
        showProductDetail(); // Called on product-detail.html
    }
});