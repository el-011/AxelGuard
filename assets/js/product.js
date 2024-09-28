// Fetch data from data.json and initialize the product list
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getRandomProducts(products, count) {
    const shuffled = products.sort(() => 0.5 - Math.random()); // Shuffle the products array
    return shuffled.slice(0, count); // Return the first 'count' products
}

function initProductList() {
    const productType = getUrlParameter('product_type');
    
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const productListEl = document.getElementById('product-list');
            if (productListEl) {
                const filteredProducts = data.products.filter(product => product.product_type === productType);
                filteredProducts.forEach(product => {
                    productListEl.appendChild(createProductCard(product));
                });
                
                // Show random related products
                const relatedProductsEl = document.getElementById('related-products');
                if (relatedProductsEl) {
                    getRandomProducts(data.products, 3).forEach(product => {
                        relatedProductsEl.appendChild(createProductCard(product));
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error loading product data:', error);
        });
}

function initProductByName() {
    const productName = getUrlParameter('name');

    // Check if productName is valid
    if (productName) {
        const productNameLower = productName.toLowerCase(); // Safe to call toLowerCase
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const productListEl = document.getElementById('product-list');
                if (productListEl) {
                    data.products
                        .filter(product => product.product_name.toLowerCase().includes(productNameLower))
                        .forEach(product => {
                            productListEl.appendChild(createProductCard(product));
                        });
                }
            })
            .catch(error => {
                console.error('Error loading product data:', error);
            });
    } else {
        console.error('No valid product name provided in the URL.');
    }
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
                                ${product.pdf_manual ? `<button onclick="openDownloadModal('${product.pdf_manual}', '${product.product_code}')" class="unique-download-btn">Download PDF Manual</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                startImageRotation(product.images);

                // Show random related products
                const relatedProductsEl = document.getElementById('related-products');
                if (relatedProductsEl) {
                    getRandomProducts(data.products.filter(p => p.product_code !== productCode), 3).forEach(product => {
                        relatedProductsEl.appendChild(createProductCard(product));
                    });
                }
            } else if (detailEl) {
                detailEl.innerHTML = '<p>Product not found</p>';
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
        });
}

function openDownloadModal(pdfUrl, productCode) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Enter Your Information</h2>
            <form id="downloadForm">
                <input type="text" id="name" placeholder="Name" required>
                <input type="email" id="email" placeholder="Email" required>
                <input type="tel" id="phone" placeholder="Phone (10 digits)" required pattern="[0-9]{10}">
                <button type="submit">Submit and Download</button>
            </form>
            <div id="statusMessage"></div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('downloadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        const scriptURL = 'https://script.google.com/macros/s/AKfycbwQzvfiIOFl8XEz1tqvnYJPt2zG4HUfiXT35pYg6UZvpk0BFIskCXKMfAyW_Jvmyp0/exec';
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Email', email);
        formData.append('Phone', phone);
        formData.append('Product_Code', productCode);

        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = 'Submitting...';

        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            if (data.result === 'success') {
                statusMessage.textContent = 'Submission successful. Opening PDF...';
                window.open(pdfUrl, '_blank');
                setTimeout(() => modal.remove(), 2000);
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusMessage.textContent = `Error: ${error.message}. Please try again.`;
        });
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
    const productListEl = document.getElementById('product-list');
    const productName = getUrlParameter('name');
    const productType = getUrlParameter('product_type');

    if (productListEl) {
        // Check if the URL contains 'name', and if so, call initProductByName
        if (productName) {
            initProductByName(); // Called when ?name= is present in the URL
        } else if (productType) {
            initProductList(); // Called when ?product_type= is present in the URL
        }
    } else if (document.getElementById('product-detail')) {
        showProductDetail(); // Called on product-detail.html
    }
});

document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const customer_name = document.getElementById('customerName').value;
    const customer_phone = document.getElementById('registeredNumber').value;
    const date = document.getElementById('callbackDate').value;
    const issueMessage = document.getElementById('issueMessage').value;
    const serviceRequestType = document.querySelector('input[name="serviceRequestType"]:checked').value;


    const scriptURL = 'https://script.google.com/macros/s/AKfycbwQzvfiIOFl8XEz1tqvnYJPt2zG4HUfiXT35pYg6UZvpk0BFIskCXKMfAyW_Jvmyp0/exec';
    const formData = new FormData();
    formData.append('CustomerName', customer_name);
    formData.append('CustomerPhone', customer_phone);
    formData.append('CallDate', date);
    formData.append('RequestType', serviceRequestType);
    formData.append('IssueMessage', issueMessage);

    const statusMessage = document.getElementById('statusMessage2');
    statusMessage.textContent = 'Submitting...';

    fetch(scriptURL, { 
        method: 'POST', 
        body: formData,
        mode: 'cors'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        if (data.result === 'success') {
            statusMessage.textContent = 'Submission successful.';
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = `Error: ${error.message}. Please try again.`;
    });
});