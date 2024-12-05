﻿
let currentPage = 1;
let totalPages = 1;
let pageSize = 100; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare

//PAGE LOAD 
document.addEventListener('DOMContentLoaded', () => {
    debugger;
    if(sessionStorage.getItem('userId') == null){
        window.location='../index.html';   
    }
    pieseApiCall();

    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());

    fetch('/admin/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
        });
});


function pieseApiCall() {
    debugger;
    const url = `${API_BASE_URL}/Piese/search?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
    // Afișează loaderul
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            populateMainGrid(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}

function populateMainGrid(data){
    const rezultateTable = document.getElementById('rezultate-tabel');
    rezultateTable.innerHTML = ''; // Resetează tabela
    data.piese.forEach(piese => {
        const piesaRow = `
            <tr data-id="${piese.id}">
                <td>${piese.id}</td>
                <td>${piese.masina}</td>
                <td>${piese.nume}</td>
                <td>${piese.tipCaroserie}</td>
                <td>${piese.pret}</td>
                <td>${piese.discount}</td>
                <td>
                    <button class="edit-button" data-id="${piese.id}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                </td>
            </tr>
        `;
        rezultateTable.innerHTML += piesaRow;
    });

    totalPages = data.totalPages; // Actualizează totalPages
    updatePaginationControls(); // Actualizează controalele de paginare

    // Adaugă eveniment pentru butoanele de editare
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            get_details(id); // Apelează funcția pentru a obține detaliile
        });
    });



    //Swal.close();

     // Întârzierea închiderii loader-ului
     setTimeout(() => {
        Swal.close(); // Închide loader-ul
    }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)


}

function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

function changePage(delta) {
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        pieseApiCall();
       // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    pieseApiCall();
}

function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;    
    pieseApiCall();
}

async function get_details(id) {
    debugger;    
    if (id) {

        const url = `piese_add.html?id=${id}`;
        window.open(url, '_blank');

    } else {
        
    }
}

//buton adauga
document.getElementById('adaugaBtn').addEventListener('click', function () {        
    const url = `piese_add.html`;
    window.open(url, '_blank');
});


//**********  cautare ********************************************************************* */

document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    pieseApiCall(); // Apelează funcția de căutare
});


document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        pieseApiCall(); // Apelează funcția de căutare
    }
});

function logout(){
    debugger;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
}


// Funcție pentru gestionarea evenimentului pageshow
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

