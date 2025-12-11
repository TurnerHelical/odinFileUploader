document.addEventListener('DOMContentLoaded', (currentUser) => {
    const modal = document.getElementById('modal');
    const background = document.getElementById('background');
    const newFolderBtn = document.getElementById('newFolderBtn');
    const form = document.getElementById('modalForm');

    // const openModal = () => {
    //     modal.classList.remove('hidden');
    //     modal.classList.add('visible');

    //     background.classList.remove('hidden');
    //     background.classList.add('visible');
    // };

    // const closeModal = () => {
    //     modal.classList.add('hidden');
    //     modal.classList.remove('visible');

    //     background.classList.add('hidden');
    //     background.classList.remove('visible');
    // };

    // closeModal();

    newFolderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const folderNameCtr = document.createElement('div');
        const nameInputLabel = document.createElement('label');
        nameInputLabel.textContent = 'Folder Name: '
        nameInputLabel.for = 'name';
        const nameInput = document.createElement('input');
        nameInput.name = 'name';
        nameInput.id = 'name';
        const userIdInput = document.createElement('input');
        userIdInput.value = `${currentUser.id}`
        userIdInput.type = 'hidden';
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.type = 'submit';
        form.appendChild(folderNameCtr);
        folderNameCtr.appendChild(nameInputLabel);
        folderNameCtr.appendChild(nameInput);
        form.appendChild(userIdInput);
        form.appendChild(submitBtn);
        form.action = '/folder';
        form.method = 'POST';

        // openModal();
    });
});
