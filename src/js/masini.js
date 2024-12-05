document.addEventListener('DOMContentLoaded', () => {
    updateResultsTable();
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());
});

let currentPage = 1;
let totalPages = 1;
let pageSize = 100; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit


function updateResultsTable() {
    const url = `${API_BASE_URL}/CarsRegister/searchMasiniReg?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
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
            const rezultateTable = document.getElementById('rezultate-tabel');
            rezultateTable.innerHTML = ''; // Resetează tabela

            data.masiniReg.forEach(car => {
                const carRow = `
                    <tr data-id="${car.id}">
                        <td>${car.id}</td>
                        <td>${car.nume}</td>
                        <td>${car.nrOrdine}</td>
        
                        
                        <td>${car.an}</td>
                        <td>${car.combustibil}</td>
                        <td>${car.tractiune}</td>
                        <td>${car.transmisie}</td>
                    
                        
                        <td>${car.skU_ID}</td>
                        <td>${car.procPtPiese}</td>
                        <td>${car.nrPiese}</td>
                        <td>${car.vizibilitate}</td>
                        <td>${car.status}</td>
                        <td>${car.images}</td>
                        <td>${car.autovit}</td>
                 
                        
                        <td>
                            <button class="edit-button" data-id="${car.id}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                        </td>
                    </tr>
                `;
                rezultateTable.innerHTML += carRow;
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

            // Întârzierea închiderii loader-ului
            setTimeout(() => {
                Swal.close(); // Închide loader-ul
            }, 200); // Rămâne deschis pentru 200 ms

        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea mașinilor.';
        });
}





function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

function changePage(delta) {
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        updateResultsTable();
       // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    updateResultsTable();
}

function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;    
    debugger;
    updateResultsTable();
}


//**********  cautare ********************************************************************* */

let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare


document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    updateResultsTable(); // Apelează funcția de căutare
});


document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        updateResultsTable(); // Apelează funcția de căutare
    }
});



async function get_details(id) {
    debugger;    
    if (id) {

        const url = `masini_add.html?id=${id}`;
        window.open(url, '_blank');

        //try {
        //    const url = `${API_BASE_URL}/Piese/async/${IdPiesa}`;
        //    const response = await fetch(url);

        //    if (!response.ok) {
        //        throw new Error('Eroare la obținerea detaliilor piesei');
        //    }

        //    const piesa = await response.json();

        //    document.getElementById('tb_piesa').value = piesa.piesa;
        //    document.getElementById('tb_titlu').value = piesa.titlu;
        //    document.getElementById('tb_descriere').value = piesa.descriere;
        //    document.getElementById('tb_imagini').value = piesa.imagini;
        //    document.getElementById('tb_pret').value = piesa.pret;
        //    document.getElementById('tb_bucati').value = piesa.bucati;
        //    document.getElementById('tb_codPiesa').value = piesa.codPiesa;
        //    document.getElementById('tb_an').value = piesa.an;

        //    // Setează marca
        //    const selectMarca = document.getElementById('ddd_cars');
        //    const marca = piesa.marca;

        //    for (let i = 0; i < selectMarca.options.length; i++) {
        //        if (selectMarca.options[i].text === marca) {
        //            selectMarca.selectedIndex = i;
        //            break;
        //        }
        //    }

        //    // Populează și setează modelul
        //    await populateModelsDropdown(marca); // Așteaptă să se populeze dropdown-ul de modele

        //    const selectModel = document.getElementById('ddd_model');
        //    const model = piesa.model;
        //    for (let i = 0; i < selectModel.options.length; i++) {
        //        if (selectModel.options[i].text === model) {
        //            selectModel.selectedIndex = i;
        //            break;
        //        }
        //    }
        //} catch (error) {
        //    console.error('Eroare:', error);
        //    document.getElementById('detaliiPiesa').innerText = 'A apărut o eroare la încărcarea detaliilor piesei.';
        //}
    } else {
        //document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
    }
}


//buton cauta
document.getElementById('adaugaBtn').addEventListener('click', function () {        
    const url = `masini_add.html`;
    window.open(url, '_blank');
});