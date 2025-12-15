
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const form = document.getElementById("modalForm");
    const newFolderBtn = document.getElementById("newFolderBtn");

    // Optional: if you have a background overlay element
    const background = document.getElementById("background");

    // --- helpers ---
    function clearForm() {
        if (!form) return;
        form.innerHTML = "";
        form.action = "";
        form.method = "POST";
        form.enctype = ""; // set when needed
    }

    function openModal() {
        if (!modal) return;
        modal.classList.remove("hidden");
        modal.classList.add("visible");

        if (background) {
            background.classList.remove("hidden");
            background.classList.add("visible");
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add("hidden");
        modal.classList.remove("visible");

        if (background) {
            background.classList.add("hidden");
            background.classList.remove("visible");
        }

        clearForm();
    }

    // Close modal if background is clicked (optional)
    if (background) {
        background.addEventListener("click", closeModal);
    }

    // --- New Folder button ---
    if (newFolderBtn) {
        newFolderBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (!form) return;

            clearForm();

            const heading = document.createElement("h3");
            heading.textContent = "Create Folder";

            const label = document.createElement("label");
            label.textContent = "Folder Name:";
            label.htmlFor = "name";

            const input = document.createElement("input");
            input.type = "text";
            input.name = "name";
            input.id = "name";
            input.required = true;

            const submit = document.createElement("button");
            submit.type = "submit";
            submit.textContent = "Create";

            const cancel = document.createElement("button");
            cancel.type = "button";
            cancel.textContent = "Cancel";
            cancel.addEventListener("click", closeModal);

            form.appendChild(heading);
            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(submit);
            form.appendChild(cancel);

            form.action = "/folder";
            form.method = "POST";

            openModal();
            input.focus();
        });
    }

    // --- Add File buttons (event delegation) ---
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".addFileBtn");
        if (!btn) return;

        e.preventDefault();
        if (!form) return;

        // NOTE: HTML data-* attrs are case-insensitive, so data-folderId becomes dataset.folderid in practice.
        const folderId = btn.dataset.folderid || btn.dataset.folderId;
        if (!folderId) {
            console.error("Add File button missing data-folderid attribute.");
            return;
        }

        clearForm();

        const heading = document.createElement("h3");
        heading.textContent = "Upload File";

        const fileLabel = document.createElement("label");
        fileLabel.textContent = "File:";
        fileLabel.htmlFor = "file";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "file"; // must match upload.single('file')
        fileInput.id = "file";
        fileInput.required = true;

        const hiddenFolderId = document.createElement("input");
        hiddenFolderId.type = "hidden";
        hiddenFolderId.name = "folderId";
        hiddenFolderId.value = folderId;

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "Upload";

        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", closeModal);

        form.appendChild(heading);
        form.appendChild(fileLabel);
        form.appendChild(fileInput);
        form.appendChild(hiddenFolderId);
        form.appendChild(submit);
        form.appendChild(cancel);

        form.action = "/file";
        form.method = "POST";
        form.enctype = "multipart/form-data"; // required for multer

        openModal();
    });
});