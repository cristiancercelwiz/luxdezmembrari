
//load event 
document.addEventListener('DOMContentLoaded', () => {
    getCarsForDropdown();  
    //updateResultsRandom();


});


let currentPage = 1; // Pagina curentă


//**********  PIESE ********************************************************************* */
//api - search piese all
function updateResultsSearchAll_func(pageNumber, searchTerm) {
    
    
    const pageSize = 12; // dimensiunea paginii

    const url = `${API_BASE_URL}/Piese/search_all?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(pageNumber)}&InregistrariPePagina=${encodeURIComponent(pageSize)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            const rezultateDiv = document.getElementById('rezultate');
            rezultateDiv.innerHTML = '';

            data.items.forEach(piesa => {
                const piesaHTML = `
                    <div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up">
                        <div style="height: 450px" class="block-4 text-center border">
                            <figure class="block-4-image">
                                <a href="shop-single.html?idPiesa=${piesa.idPiesa}"><img src="${piesa.imagini}" alt="Image placeholder" class="img-fluid"></a>
                            </figure>
                            <div class="block-4-text p-4">
                                <h3><a href="shop-single.html?idPiesa=${piesa.idPiesa}">${piesa.piesa}</a></h3>
                                <p class="mb-0">Marca: ${piesa.marca}</p>
                                <p class="mb-0">Model: ${piesa.model}</p>
                                <p class="mb-0">Varianta: ${piesa.varianta}</p>    
                                <p class="mb-0">Bucati: ${piesa.bucati}</p>    
                                <p class="text-primary font-weight-bold">${piesa.pret} RON</p>
                            </div>
                        </div>
                    </div>
                `;
                rezultateDiv.innerHTML += piesaHTML;

            });

            // Actualizează starea paginării
            updatePaginator(pageNumber, data.TotalPages);

            // Derulează pagina la început
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Derulare lină
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}
//update paginator
function updatePaginator(pageNumber) {
    debugger;
    currentPage = pageNumber;

    const pageLinks = document.querySelectorAll('#paginator .blank');
    pageLinks.forEach(link => {
        if (link.getAttribute('data-page') == pageNumber) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}
//buton cauta
document.getElementById('cautaBtn').addEventListener('click', function () {    
    updateResultsSearchAll(1, 'button');
});
//paginator
document.querySelectorAll('#paginator .blank').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const pageNumber = parseInt(this.getAttribute('data-page'), 10);
        var x = document.getElementById('searchTerm').value;
        if (x == '') {
            updateResultsSearchAll(pageNumber, 'dd');
        }
        else {
            updateResultsSearchAll(pageNumber, 'button');
        }
        
    });
});
//next button
document.getElementById('prev').addEventListener('click', function (event) {
    event.preventDefault();
    if (currentPage > 1) {

        var x = document.getElementById('searchTerm').value;
        if (x == '') {
            updateResultsSearchAll(currentPage - 1, 'dd');
        }
        else {
            updateResultsSearchAll(currentPage - 1, 'button');
        }

        
    }
});
//previous button
document.getElementById('next').addEventListener('click', function (event) {
    event.preventDefault();
   
    var x = document.getElementById('searchTerm').value;
    if (x == '') {
        
        updateResultsSearchAll(currentPage + 1, 'dd');
    }
    else {        
        updateResultsSearchAll(currentPage + 1, 'button');
    }
});
function updateResultsRandom() {   
    debugger;
    const url = `${API_BASE_URL}/Piese/get_random`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            const rezultateDiv = document.getElementById('rezultate');
            rezultateDiv.innerHTML = '';

            data.forEach(piesa => {
                const piesaHTML = `
                    <div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up">
                        <div style="height: 450px" class="block-4 text-center border">
                            <figure class="block-4-image">
                                <a href="shop-single.html?idPiesa=${piesa.idPiesa}"><img src="${piesa.imagini}" alt="Image placeholder" class="img-fluid"></a>
                            </figure>
                            <div class="block-4-text p-4">
                                <h3><a href="shop-single.html?idPiesa=${piesa.idPiesa}">${piesa.piesa}</a></h3>
                                <p class="mb-0">Marca: ${piesa.marca}</p>
                                <p class="mb-0">Model: ${piesa.model}</p>
                                <p class="mb-0">Varianta: ${piesa.varianta}</p>    
                                <p class="mb-0">Bucati: ${piesa.bucati}</p>    
                                <p class="text-primary font-weight-bold">${piesa.pret} RON</p>
                            </div>
                        </div>
                    </div>
                `;
                rezultateDiv.innerHTML += piesaHTML;

            });          
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}





//**********  MASINI ********************************************************************* */


//api_get
async function getCarsForDropdown() {
    debugger;
    try {
        const response = await fetch('${API_BASE_URL}/Cars/get', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cars = await response.json();
        populateDropdown(cars);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
//populate drop down cars
function populateDropdown(cars) {
    const dropdown = document.getElementById('ddd_cars'); 
    dropdown.innerHTML = '<option value="">Marca</option>';

    // Adaugă opțiunile din lista de mașini
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.Id; // `id` corespunde `Id` din C#
        option.text = car.marca; // `f2` corespunde `F2` din C#
        dropdown.appendChild(option);
    });
}







//**********  MODELE ********************************************************************* */

//event change marca
document.getElementById('ddd_cars').addEventListener('change', async function () {
    debugger;
    document.getElementById('searchTerm').value = "";
    document.getElementById('piesaTermLeft').value = "";
    const selectedMarca = this.options[this.selectedIndex].text;    
    if (selectedMarca && selectedMarca !== "Marca") {
        await populateModelsDropdown(selectedMarca);
    } else {
        clearDropdown('ddd_model');
    }
});
//api_get
async function populateModelsDropdown(marca) {
    debugger;
    try {      
        const response = await fetch(`${API_BASE_URL}/Cars/getModels?marca=${encodeURIComponent(marca)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const models = await response.json();
        populateDropdownModel('ddd_model', models);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
//populate drop down model
function populateDropdownModel(dropdownId, items) {
    debugger;
    const dropdown = document.getElementById(dropdownId);

    // Resetează dropdown-ul și adaugă opțiunea implicită
    dropdown.innerHTML = '<option value="">Model</option>';

    // Adaugă opțiunile din lista de modele
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; 
        option.text = item.model; 
        dropdown.appendChild(option);
    });
}
//clear model drow down
function clearDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Model</option>';
}
//event change ddd_model
document.getElementById('ddd_model').addEventListener('change', async function () {  
    document.getElementById('searchTerm').value = "";    
    document.getElementById('piesaTermLeft').value = "";
});



//**********  CAUTARE ALL ********************************************************************* */

//cautare all
function updateResultsSearchAll(pageNumber, type) {
    debugger;
    var searchTerm = '';

    var Car = document.getElementById('ddd_cars');    
    var selectedCar = Car.options[Car.selectedIndex].text == 'Marca' ? "" : Car.options[Car.selectedIndex].text;

    var Model = document.getElementById('ddd_model');
    var selectedModel = Model.options[Model.selectedIndex].text == 'Model' ? "" : Model.options[Model.selectedIndex].text;

    var piesa = document.getElementById('piesaTermLeft').value;

    if (type == 'button') {
        searchTerm = document.getElementById('searchTerm').value;
    }
    else {
        searchTerm = selectedCar + ' ' + selectedModel + ' ' + piesa;
    }

    updateResultsSearchAll_func(pageNumber, searchTerm.trim());

}

//buton cauta
document.getElementById('cautaLeftBtn').addEventListener('click', function () {
    updateResultsSearchAll(1, 'dd');
});





//****** AUTOCOMPLETE  ************************************************************************ */

//api load sugestii
async function fetchSuggestions(term) {
    debugger;
    const Car = document.getElementById('ddd_cars'); 
    var selectedCar = Car.options[Car.selectedIndex].text == 'Marca' ? "" : Car.options[Car.selectedIndex].text;

    var Model = document.getElementById('ddd_model');
    var selectedModel = Model.options[Model.selectedIndex].text == 'Model' ? "" : Model.options[Model.selectedIndex].text;

    let url = `${API_BASE_URL}/Piese/get-parts?term=${encodeURIComponent(term)}`;

    if (selectedCar) {
        url += `&marca=${encodeURIComponent(selectedCar)}`;
    }

    if (selectedModel) {
        url += `&model=${encodeURIComponent(selectedModel)}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Funcția care arată sugestiile
function showSuggestions(suggestions) {
    const container = document.getElementById('suggestions-container');
    container.innerHTML = ''; 

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.classList.add('autocomplete-suggestion');
        div.innerText = suggestion.piesa;
        div.dataset.id = suggestion.idPiesa;

        div.addEventListener('click', function () {
            document.getElementById('piesaTermLeft').value = suggestion.piesa;
            container.innerHTML = ''; // Golește lista de sugestii după selectare
        });

        container.appendChild(div);
    });
}

// user input
document.getElementById('piesaTermLeft').addEventListener('input', async function () {
    const term = this.value;

    if (term.length >= 2) { 
        const suggestions = await fetchSuggestions(term);
        showSuggestions(suggestions);
    } else {
        document.getElementById('suggestions-container').innerHTML = ''; 
    }
});