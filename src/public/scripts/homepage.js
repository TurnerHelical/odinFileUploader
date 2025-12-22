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

function closeAllFolderMenus(except = null) {
    document.querySelectorAll(".folderOptionsMenu").forEach((menu) => {
        if (menu !== except) menu.classList.add("hidden");
    });
}

function closeAllFileMenus(except = null) {
    document.querySelectorAll(".fileButtonCtr").forEach((menu) => {
        if (menu !== except) menu.classList.add("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const state = window.__MODAL_STATE__ || null;

    // Restore modal state (server-driven)
    if (state?.id) {
        openModalFromTemplate(state.id);

        if (state.id === "tpl-add-file" && state.folderId) {
            const form = document.getElementById("form-add-file");
            if (form) form.action = `/file/${state.folderId}`;
        }

        if (state.id === "tpl-rename-folder" && state.folderId) {
            const form = document.getElementById("form-rename-folder");
            if (form) form.action = `/folder/${state.folderId}/update`;

            const input = document.getElementById("renameFolderId");
            if (input) input.value = state.folderId;
        }

        if (state.id === "tpl-delete-folder" && state.folderId) {
            const form = document.getElementById("form-delete-folder");
            if (form) form.action = `/folder/${state.folderId}/delete`;

            const input = document.getElementById("deleteFolderId");
            if (input) input.value = state.folderId;
        }

        if (state.id === "tpl-rename-file" && state.fileId) {
            const form = document.getElementById("form-rename-file");
            if (form) form.action = `/file/${state.fileId}/update`;

            const input = document.getElementById("renameFileId");
            if (input) input.value = state.fileId;
        }

        if (state.id === "tpl-delete-file" && state.fileId) {
            const form = document.getElementById("form-delete-file");
            if (form) form.action = `/file/${state.fileId}/delete`;

            const input = document.getElementById("deleteFileId");
            if (input) input.value = state.fileId;
        }

        if (state.values && state.formId) {
            const form = document.getElementById(state.formId);
            if (form) {
                Object.entries(state.values).forEach(([name, value]) => {
                    const el = form.querySelector(`[name="${name}"]`);
                    if (el && el.type !== "file") el.value = value ?? "";
                });
            }
        }
    }

    const bg = document.getElementById("background");
    if (bg) bg.addEventListener("click", closeModal);

    document.addEventListener("click", (e) => {
        // -------------------------------------------------------
        // 1) Folder options menu (3 dots SVG) - handle FIRST
        // -------------------------------------------------------
        const folderIcon = e.target.closest('svg[data-folderid]');
        if (folderIcon) {
            e.preventDefault();

            const folderId = folderIcon.dataset.folderid;
            const menu = document.querySelector(
                `.folderOptionsMenu[data-folderid="${folderId}"]`
            );

            if (!menu) return;

            closeAllFolderMenus(menu);
            closeAllFileMenus(); // optional: close file menus too
            menu.classList.toggle("hidden");
            return;
        }

        const downloadBtn = e.target.closest(".downloadBtn");
        if (downloadBtn) {
            e.preventDefault();
            const fileId = downloadBtn.dataset.fileid;
            window.location.href = `/file/${fileId}/download`;
            return;
        }

        // -------------------------------------------------------
        // 2) File options menu (options.svg image)
        // -------------------------------------------------------
        const fileOptionsIcon = e.target.closest('img.fileOptions[data-fileid]');
        if (fileOptionsIcon) {
            e.preventDefault();

            const fileItem = fileOptionsIcon.closest(".fileItem");
            if (!fileItem) return;

            const menu = fileItem.querySelector(".fileButtonCtr");
            if (!menu) return;

            closeAllFileMenus(menu);
            closeAllFolderMenus(); // optional: close folder menus too
            menu.classList.toggle("hidden");
            return;
        }

        // -------------------------------------------------------
        // 3) Folder dropdown toggle (show/hide files)
        //    Click folder header EXCEPT clicks on controls
        // -------------------------------------------------------
        const folderHeader = e.target.closest(".folderName");
        if (folderHeader) {
            // ignore clicks on interactive controls inside header
            if (e.target.closest("button, a, input, svg")) return;

            const folder = folderHeader.closest(".folder");
            if (!folder) return;

            const dropdown = folder.querySelector(".fileDropdownCtr");
            if (!dropdown) return;

            dropdown.classList.toggle("hidden");
            return;
        }

        // -------------------------------------------------------
        // 4) Close menus when clicking outside
        // -------------------------------------------------------
        if (
            !e.target.closest(".folderOptionsMenu") &&
            !e.target.closest('svg[data-folderid]') &&
            !e.target.closest(".fileButtonCtr") &&
            !e.target.closest("img.fileOptions")
        ) {
            closeAllFolderMenus();
            closeAllFileMenus();
        }

        // -------------------------------------------------------
        // 5) Modals
        // -------------------------------------------------------
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

            closeAllFolderMenus();
            openModalFromTemplate("tpl-rename-folder");

            const form = document.getElementById("form-rename-folder");
            if (form && folderId) form.action = `/folder/${folderId}/update`;
            return;
        }

        const deleteFolderBtn = e.target.closest(".deleteFolder");
        if (deleteFolderBtn) {
            e.preventDefault();
            const folderId = deleteFolderBtn.dataset.folderid;

            closeAllFolderMenus();
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

            closeAllFileMenus();
            openModalFromTemplate("tpl-rename-file");

            const form = document.getElementById("form-rename-file");
            if (form && fileId) form.action = `/file/${fileId}/update`;
            return;
        }

        const deleteFileBtn = e.target.closest(".deleteFileBtn");
        if (deleteFileBtn) {
            e.preventDefault();
            const fileId = deleteFileBtn.dataset.fileid;

            closeAllFileMenus();
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
