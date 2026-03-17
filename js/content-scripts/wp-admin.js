// Tool Island
const logoUrl = chrome.runtime.getURL('../../img/svg/white-hole.svg');

const tool = `
<div id="toolIsland">
    <div id="titleBar">
        <img src="${logoUrl}" alt="White Hole">
    </div>
    <div id="toolElementBar">
        <button class="btn-tools edit-all" id="editAllBtn">
            <img style="margin-bottom: -0.2rem;" src="https://api.iconify.design/material-symbols:edit-note-rounded.svg?color=%23ffffff" alt="Edit" class="icon-btn">
            Editar todos
        </button>
        <button class="btn-tools edit-all" id="viewAllBtn">
            <img style="margin-bottom: -0.1rem;" src="https://api.iconify.design/ic:baseline-remove-red-eye.svg?color=%23ffffff" alt="View" class="icon-btn">
            Ver todos
        </button>
        <button class="btn-tools edit-all" id="viewSelectedBtn">
            <img style="margin-bottom: -0.1rem;" src="https://api.iconify.design/material-symbols:multimodal-hand-eye-rounded.svg?color=%23ffffff" alt="View" class="icon-btn">
            Ver selecionados
        </button>
    </div>
</div>
`

let island = newElement("div", "island")
island.innerHTML = tool

let hideBarTimeout;
let shrinkIslandTimeout;

const toolIsland = document.getElementById('toolIsland');
const toolElementBar = document.getElementById("toolElementBar");
const titleBar = document.getElementById("titleBar");

toolIsland.addEventListener('click', () => {
    clearTimeout(hideBarTimeout);
    clearTimeout(shrinkIslandTimeout);
    
    toolIsland.classList.add('active-bar');
    toolElementBar.classList.add('visible');
    titleBar.classList.add('hidden');
});

toolIsland.addEventListener('mouseleave', () => {
    hideBarTimeout = setTimeout(() => {
        
        toolElementBar.classList.remove('visible');
        
        shrinkIslandTimeout = setTimeout(() => {
            toolIsland.classList.remove('active-bar');
            titleBar.classList.remove('hidden');
        }, 400);
    }, 1500); 
});

toolIsland.addEventListener('mouseenter', () => {
    clearTimeout(hideBarTimeout);
    clearTimeout(shrinkIslandTimeout);
    
    if (toolIsland.classList.contains('active-bar')) {
        toolElementBar.classList.add('visible');
    }
});

// Elements

const selectAllCheck = document.querySelector('.check-column input[type="checkbox"]');
const bulkActionField = document.getElementById('bulk-action-selector-top');
const applyBulkAction = document.getElementById('doaction');

const editAllBtn = document.getElementById('editAllBtn');

editAllBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if (selectAllCheck && bulkActionField && applyBulkAction) {
        if (!selectAllCheck.checked) {
            selectAllCheck.click();
        }
        bulkActionField.value = 'edit';
        applyBulkAction.click();
    } else {
        console.warn("A automação de edição em massa falhou: Um ou mais elementos não foram encontrados na página.");
    }
});

const viewAllClick = document.querySelectorAll('.view a')
const viewAllBtn = document.getElementById('viewAllBtn')

if (viewAllBtn) {
    viewAllBtn.addEventListener("click", function(event){
        event.preventDefault();

        viewAllClick.forEach(el => {
            chrome.runtime.sendMessage({ message: "create-new-tab", url: el.href });
        });
    });
}

const viewSelectedBtn = document.getElementById('viewSelectedBtn');

if (viewSelectedBtn) {
    viewSelectedBtn.addEventListener("click", function(event) {
        event.preventDefault();

        const checkedBoxes = document.querySelectorAll('tbody .check-column input[type="checkbox"]:checked');

        if (checkedBoxes.length === 0) {
            console.warn("Nenhum item foi selecionado para visualização.");
            return;
        }

        checkedBoxes.forEach(checkbox => {
            const row = checkbox.closest('tr'); 

            if (row) {
                const viewLink = row.querySelector('.view a');

                if (viewLink && viewLink.href) {
                    chrome.runtime.sendMessage({ message: "create-new-tab", url: viewLink.href });
                }
            }
        });
    });
}
