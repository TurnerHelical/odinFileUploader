function openModalFromTemplate(templateId) {
    const tpl = document.getElementById(templateId);
    if (!tpl) {
        console.error(`Template not found: ${templateId}`);
        return;
    }

    const modal = document.getElementById("modal");
    const bg = document.getElementById("background");
    const body = document.getElementById("modalBody");

    if (!modal || !bg || !body) return;

    body.innerHTML = "";
    body.appendChild(tpl.content.cloneNode(true));

    modal.classList.remove("hidden");
    bg.classList.remove("hidden");

    // Close buttons inside the injected content
    body.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", closeModal);
    });
}

function closeModal() {
    const modal = document.getElementById("modal");
    const bg = document.getElementById("background");
    const body = document.getElementById("modalBody");

    if (modal) modal.classList.add("hidden");
    if (bg) bg.classList.add("hidden");
    if (body) body.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const bg = document.getElementById("background");
    if (bg) bg.addEventListener("click", closeModal);


    document.addEventListener("click", (e) => {

        const newFolderBtn = e.target.closest("#newFolderBtn");
        if (newFolderBtn) {
            e.preventDefault();
            openModalFromTemplate("tpl-add-folder");
            return;
        }


        const renameFolderBtn = e.target.closest(".renameFolder");
        if (renameFolderBtn) {
            e.preventDefault();
            const folderId = renameFolderBtn.dataset.folderid;
            openModalFromTemplate("tpl-rename-folder");
            const form = document.getElementById("form-rename-folder");
            if (form && folderId) form.action = `/folder/${folderId}/update`;
            return;
        }


        const deleteFolderBtn = e.target.closest(".deleteFolder");
        if (deleteFolderBtn) {
            e.preventDefault();
            const folderId = deleteFolderBtn.dataset.folderid;
            openModalFromTemplate("tpl-delete-folder");
            const form = document.getElementById("form-delete-folder");
            if (form && folderId) form.action = `/folder/${folderId}/delete`;
            return;
        }


        const addFileBtn = e.target.closest(".addFileBtn");
        if (addFileBtn) {
            e.preventDefault();
            const folderId = addFileBtn.dataset.folderid;
            openModalFromTemplate("tpl-add-file");
            const form = document.getElementById("form-add-file");
            if (form && folderId) form.action = `/file/${folderId}`;
            return;
        }


        const renameFileBtn = e.target.closest(".renameFileBtn");
        if (renameFileBtn) {
            e.preventDefault();
            const fileId = renameFileBtn.dataset.fileid;
            openModalFromTemplate("tpl-rename-file");
            const form = document.getElementById("form-rename-file");
            if (form && fileId) form.action = `/file/${fileId}/update`;
            return;
        }


        const deleteFileBtn = e.target.closest(".deleteFileBtn");
        if (deleteFileBtn) {
            e.preventDefault();
            const fileId = deleteFileBtn.dataset.fileid;
            openModalFromTemplate("tpl-delete-file");
            const form = document.getElementById("form-delete-file");
            if (form && fileId) form.action = `/file/${fileId}/delete`;
            return;
        }


        const closeBtn = e.target.closest("[data-close]");
        if (closeBtn) {
            e.preventDefault();
            closeModal();
        }
    });
});
