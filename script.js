document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const imageInfo = document.getElementById('image-info');
    const filterLinks = document.querySelectorAll('.nav-link');
    
    // Global variables
    let currentImageIndex = 0;
    let images = [];
    let filteredImages = [];
    
    // Fetch images from JSON file
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            images = data;
            filteredImages = [...images];
            displayImages(filteredImages);
            
            // Set up filter event listeners
            filterLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Update active class
                    filterLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.dataset.filter;
                    
                    if (filter === 'all') {
                        filteredImages = [...images];
                    } else {
                        filteredImages = images.filter(img => img.tags.includes(filter));
                    }
                    
                    displayImages(filteredImages);
                });
            });
        })
        .catch(error => console.error('Error loading images:', error));
    
    // Display images in the gallery
    function displayImages(imagesToDisplay) {
        gallery.innerHTML = '';
        
        if (imagesToDisplay.length === 0) {
            gallery.innerHTML = '<p class="no-images">No images found in this category.</p>';
            return;
        }
        
        imagesToDisplay.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.index = index;
            
            galleryItem.innerHTML = `
                <img src="images/${image.filename}" alt="${image.title}" class="gallery-img">
                <div class="image-caption">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => openLightbox(index));
            gallery.appendChild(galleryItem);
        });
    }
    
    // Open lightbox with selected image
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Update lightbox content
    function updateLightbox() {
        const image = filteredImages[currentImageIndex];
        lightboxImg.src = `images/${image.filename}`;
        lightboxImg.alt = image.title;
        
        imageInfo.innerHTML = `
            <h3>${image.title}</h3>
            <p>${image.description}</p>
            <p class="image-date">${image.date}</p>
            <div class="image-tags">
                ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
            </div>
        `;
    }
    
    // Navigate to previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        updateLightbox();
    }
    
    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        updateLightbox();
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
});
