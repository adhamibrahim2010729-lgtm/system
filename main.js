let codeInput = document.getElementById('codeInput');
let priceInput = document.getElementById('priceInput');
let categoryInput = document.getElementById('categoryInput');
let descriptionInput = document.getElementById('descriptionInput');

let addBtn = document.querySelector('.add-btn');
let updateBtn = document.querySelector('.update-main');
let searchInput = document.querySelector('.search-input');
let tableBody = document.querySelector('tbody');

let langToggleBtn = document.getElementById('langToggleBtn');
let themeToggleBtn = document.getElementById('themeToggleBtn');

let products = JSON.parse(localStorage.getItem('products')) || [
    {
        code: '101',
        price: '15000',
        category: 'Phones',
        description: 'Samsung smartphone with 128GB storage.'
    },
    {
        code: '102',
        price: '20000',
        category: 'Laptops',
        description: 'HP laptop, Core i5, 8GB RAM.'
    },
    {
        code: '103',
        price: '500',
        category: 'Accessories',
        description: 'Wireless mouse, USB, black color.'
    }
];

let editIndex = -1;


let currentLang = localStorage.getItem('lang') || 'en';

const translations = {
    en: {
        mainTitle: "🛒 Product CRUD System",
        subTitle: "Manage your products easily",
        productInfoTitle: "◈ Product Information",
        productCodeLabel: "Product Code",
        productCodePlaceholder: "Enter product code",
        productPriceLabel: "Product Price",
        productPricePlaceholder: "Enter product price",
        productCategoryLabel: "Product Category",
        productCategoryPlaceholder: "Enter product category",
        productDescLabel: "Product Description",
        productDescPlaceholder: "Enter product description...",
        addBtn: "+ Add Product",
        updateBtn: "✎ Update Product",
        searchTitle: "⌕ Search Products",
        searchPlaceholder: "⌕ Search by Code...",
        listTitle: "▦ Products List",
        thNum: "#",
        thCode: "Code",
        thPrice: "Price",
        thCategory: "Category",
        thDesc: "Description",
        thActions: "Actions",
        editBtnText: "✎ Update",
        deleteBtnText: "▣ Delete",
        msgFillAll: "Please fill all fields!",
        msgExists: "Product code already exists!",
        msgAdded: "Product added successfully!",
        msgSelectFirst: "Please select a product first!",
        msgUpdated: "Product updated successfully!",
        msgConfirmDelete: "Are you sure you want to delete this product?",
        msgDeleted: "Product deleted successfully!"
    },
    ar: {
        mainTitle: "🛒 نظام إدارة المنتجات",
        subTitle: "قم بإدارة منتجاتك بسهولة",
        productInfoTitle: "◈ معلومات المنتج",
        productCodeLabel: "كود المنتج",
        productCodePlaceholder: "أدخل كود المنتج",
        productPriceLabel: "سعر المنتج",
        productPricePlaceholder: "أدخل سعر المنتج",
        productCategoryLabel: "قسم المنتج",
        productCategoryPlaceholder: "أدخل قسم المنتج",
        productDescLabel: "وصف المنتج",
        productDescPlaceholder: "أدخل وصف المنتج...",
        addBtn: "+ إضافة منتج",
        updateBtn: "✎ تعديل المنتج",
        searchTitle: "⌕ البحث عن المنتجات",
        searchPlaceholder: "⌕ ابحث بالكود...",
        listTitle: "▦ قائمة المنتجات",
        thNum: "#",
        thCode: "الكود",
        thPrice: "السعر",
        thCategory: "القسم",
        thDesc: "الوصف",
        thActions: "الإجراءات",
        editBtnText: "✎ تعديل",
        deleteBtnText: "▣ حذف",
        msgFillAll: "الرجاء ملء جميع الحقول!",
        msgExists: "كود المنتج موجود مسبقاً!",
        msgAdded: "تم إضافة المنتج بنجاح!",
        msgSelectFirst: "الرجاء اختيار منتج أولاً!",
        msgUpdated: "تم تحديث المنتج بنجاح!",
        msgConfirmDelete: "هل أنت متأكد من رغبتك في حذف هذا المنتج؟",
        msgDeleted: "تم حذف المنتج بنجاح!"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        langToggleBtn.textContent = 'English';
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        langToggleBtn.textContent = 'عربي';
    }

  
    document.querySelectorAll('[data-i18n]').forEach(el => {
        let key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        let key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    displayProducts();
}

langToggleBtn.addEventListener('click', function() {
    if (currentLang === 'en') {
        setLanguage('ar');
    } else {
        setLanguage('en');
    }
});



let currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️ Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = '🌙 Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

themeToggleBtn.addEventListener('click', function() {
    if (document.body.classList.contains('dark-mode')) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});


function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}


function clearInputs() {
    codeInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    descriptionInput.value = '';

    editIndex = -1;
}


function displayProducts(list = products) {

    tableBody.innerHTML = '';

    list.forEach(function(product, index) {

        let realIndex = products.indexOf(product);

        let row = document.createElement('tr');

        let number = document.createElement('td');
        number.textContent = index + 1;

        let code = document.createElement('td');
        code.textContent = product.code;

        let price = document.createElement('td');
        let currencyLabel = currentLang === 'ar' ? ' ج.م' : ' EG';
        price.textContent = Number(product.price).toLocaleString() + currencyLabel;

        let category = document.createElement('td');
        category.textContent = product.category;

        let description = document.createElement('td');
        description.textContent = product.description;

        let actions = document.createElement('td');

        let editButton = document.createElement('button');
        editButton.textContent = translations[currentLang].editBtnText;
        editButton.className = 'action-btn edit-btn';

        editButton.addEventListener('click', function() {
            editProduct(realIndex);
        });

        let deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLang].deleteBtnText;
        deleteButton.className = 'action-btn delete-btn';

        deleteButton.addEventListener('click', function() {
            deleteProduct(realIndex);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        row.appendChild(number);
        row.appendChild(code);
        row.appendChild(price);
        row.appendChild(category);
        row.appendChild(description);
        row.appendChild(actions);

        tableBody.appendChild(row);
    });
}


addBtn.addEventListener('click', function() {

    let code = codeInput.value.trim();
    let price = priceInput.value.trim();
    let category = categoryInput.value.trim();
    let description = descriptionInput.value.trim();

    if (!code || !price || !category || !description) {
        alert(translations[currentLang].msgFillAll);
        return;
    }

    let exists = products.some(function(product) {
        return product.code === code;
    });

    if (exists) {
        alert(translations[currentLang].msgExists);
        return;
    }

    let product = {
        code: code,
        price: price,
        category: category,
        description: description
    };

    products.push(product);

    saveProducts();
    displayProducts();
    clearInputs();

    alert(translations[currentLang].msgAdded);
});


updateBtn.addEventListener('click', function() {

    if (editIndex === -1) {
        alert(translations[currentLang].msgSelectFirst);
        return;
    }

    let code = codeInput.value.trim();
    let price = priceInput.value.trim();
    let category = categoryInput.value.trim();
    let description = descriptionInput.value.trim();

    if (!code || !price || !category || !description) {
        alert(translations[currentLang].msgFillAll);
        return;
    }

    let exists = products.some(function(product, index) {
        return product.code === code && index !== editIndex;
    });

    if (exists) {
        alert(translations[currentLang].msgExists);
        return;
    }

    products[editIndex] = {
        code: code,
        price: price,
        category: category,
        description: description
    };

    saveProducts();
    displayProducts();
    clearInputs();

    alert(translations[currentLang].msgUpdated);
});


function editProduct(index) {

    codeInput.value = products[index].code;
    priceInput.value = products[index].price;
    categoryInput.value = products[index].category;
    descriptionInput.value = products[index].description;

    editIndex = index;
}

function deleteProduct(index) {

    let confirmDelete = confirm(translations[currentLang].msgConfirmDelete);

    if (confirmDelete) {

        products.splice(index, 1);

        saveProducts();
        displayProducts();
        clearInputs();

        alert(translations[currentLang].msgDeleted);
    }
}


searchInput.addEventListener('input', function() {

    let searchValue = searchInput.value.toLowerCase().trim();

    let filteredProducts = products.filter(function(product) {

        return product.code.toLowerCase().includes(searchValue);

    });

    displayProducts(filteredProducts);
});



setLanguage(currentLang);
setTheme(currentTheme);