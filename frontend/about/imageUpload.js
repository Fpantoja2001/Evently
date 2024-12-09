function handleImageUpload(containerId, onUpload) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }
    container.innerHTML = '';

    const imagePreview = document.createElement('img');
    imagePreview.alt = 'Preview Image';
    imagePreview.style.width = '150px';
    imagePreview.style.height = '150px';
    imagePreview.style.objectFit = 'cover';
    imagePreview.style.border = '1px solid #ccc';
    imagePreview.style.display = 'block';
    imagePreview.style.marginBottom = '10px';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'block';

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imagePreview.src = e.target.result;

                if (onUpload && typeof onUpload === 'function') {
                    onUpload(e.target.result); // Pass Base64 string
                }
            };

            reader.readAsDataURL(file);
        }
    });

    container.appendChild(imagePreview);
    container.appendChild(fileInput);
}
