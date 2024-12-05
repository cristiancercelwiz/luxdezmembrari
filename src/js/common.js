async function get(link) {
    try {
        const response = await fetch(link, {
            method: 'GET'
        });

        if (response.status === 404) {
            return null; // Returnează null pentru NotFound
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const objects = await response.json();
        return objects; // Returnează datele
    } catch (error) {
        if (error.message.includes('HTTP error! status: 404')) {
            console.log('Codul nu a fost găsit.'); // Mesaj prietenos pentru NotFound
            return null;
        } else {
            console.error('A apărut o eroare la apelarea API-ului:', error);
            return null; // Returnează null în caz de alte erori
        }
    }
}



async function insert(data, link) {
    const response = await fetch(link, {  // Așteptăm ca fetch să fie finalizat
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Eroare la înregistrare');
    }
    return response.json();  // Returnăm datele JSON pentru a putea fi folosite mai departe
}

async function update(id, data, link) {    
    const url = link;
    data.Id = id;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la actualizarea mașinii');
        }        
        return response.text(); // API-ul returnează NoContent, deci nu va fi JSON
    })
    .then(result => {
        debugger;   
    })                 
}


//GET SELECTED
function getSelectedValue(selectId) {
    const selectElement = document.getElementById(selectId);
    return selectElement ? selectElement.value : null;
}
async function setSelectedValue(selectId, value) {
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].text === value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}  

//GET LISTS
function getBrandList() {
    const brandDropdown = document.getElementById('ddd_cars');
    return Array.from(brandDropdown.options)
                .map(option => option.text)
                .filter(text => text.trim() !== '');
}
function getModelList() {
    const modelDropdown = document.getElementById('ddd_models');
    return Array.from(modelDropdown.options)
                .map(option => option.text)
                .filter(text => text.trim() !== '');
}
function getGeneratieList() {
    const generatieDropdown = document.getElementById('ddd_generatii');
    return Array.from(generatieDropdown.options)
                .map(option => option.text)
                .filter(text => text.trim() !== '');
}

//EXTRACT
function extractCarBrand(fullName) {
    let brand = '';
    let parts = fullName.split(' ');

    const brandList = getBrandList(); // Obține lista de branduri actuală

    for (let i = 0; i < parts.length; i++) {
        if (brand) brand += ' ';
        brand += parts[i];

        // Verifică dacă brandul este valid
        if (brandList.includes(brand)) {
            return brand;
        }
    }

    return 'Unknown Brand'; // Dacă nu se găsește niciun brand
}
async function extractCarModel(fullName, brand) {
    //debugger;
    const brandEndIndex = fullName.indexOf(brand) + brand.length;
    let rest = fullName.substring(brandEndIndex).trim();
    
    let model = '';
    let parts = rest.split(/ (?=\S)/); // Împarte la prima apariție a unui spațiu urmat de un caracter non-spațiu

    const modelList = getModelList(); // Obține lista de modele actuală

    for (let i = 0; i < parts.length; i++) {
        if (model) model += ' ';
        model += parts[i];    
        if (modelList.includes(model)) {
            return model;
        }
    }
    return 'Unknown Model'; // Dacă nu se găsește niciun model
}
async function extractCarGeneratie(fullName, model) {
    // Înlocuiește parantezele pătrate cu paranteze rotunde
    fullName = fullName.replace(/\[/g, '(').replace(/\]/g, ')');

    const modelIndex = fullName.indexOf(model) + model.length;
    let rest = fullName.substring(modelIndex).trim();
    
    let generatie = '';
    let parts = rest.split(/ (?=\S)/); // Împarte la prima apariție a unui spațiu urmat de un caracter non-spațiu

    const generatieList = getGeneratieList(); // Obține lista de generații actuală

    for (let i = 0; i < parts.length; i++) {
        if (generatie) generatie += ' ';
        generatie += parts[i];
        
        // Verifică dacă generația este validă
        if (generatieList.includes(generatie)) {
            return generatie;
        }
    }

    return 'Unknown Generation'; // Dacă nu se găsește nicio generație
}

//POPULATE
function populateDropdown(cars) {
    const dropdown = document.getElementById('ddd_cars');
    dropdown.innerHTML = '<option value="">Marca</option>';
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.marcaID; // `id` corespunde `Id` din C#
        option.text = car.marcaName; // `f2` corespunde `F2` din C#
        dropdown.appendChild(option);
    });
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
}
function populateModelsDropdown(models) {
    const dropdown = document.getElementById('ddd_models');
    dropdown.innerHTML = '<option value="">Model</option>'; // Resetare dropdown

    // Adaugă opțiunile din lista de modele
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.modelID; // `id` corespunde `Id` din C#
        option.text = model.modelName; // `name` corespunde `Name` din C#
        dropdown.appendChild(option);
    });
}
function populateGeneratiiDropdown(generatii) {
    const dropdown = document.getElementById('ddd_generatii');
    dropdown.innerHTML = '<option value="">Generație</option>'; // Resetare dropdown

    // Adaugă opțiunile din lista de generații
    generatii.forEach(generatie => {
        const option = document.createElement('option');
        option.value = generatie.generatieID; // `id` corespunde `Id` din C#
        option.text = generatie.generatieName; // `name` corespunde `Name` din C#
        dropdown.appendChild(option);
    });
}

//EVENT
const dddCarsElement = document.getElementById('ddd_cars');

if (dddCarsElement) {
    dddCarsElement.addEventListener('change', function() {
        const marcaId = this.value;
        if (marcaId) {
            getModelsForDropdown(marcaId);
        } else {
            // Curăță dropdown-ul de modele dacă nu este selectată nicio marcă
            document.getElementById('ddd_models').innerHTML = '<option value="">Model</option>';
        }
    });
}

const dddModelsElement = document.getElementById('ddd_models');
if (dddModelsElement) {
    document.getElementById('ddd_models').addEventListener('change', function() {
        const modelId = this.value;
        if (modelId) {
            getGeneratiiForDropdown(modelId);
        } else {
            // Curăță dropdown-ul de generații dacă nu este selectat niciun model
            document.getElementById('ddd_generatii').innerHTML = '<option value="">Generație</option>';
        }
    });
}




//COMMON
async function getCars(link) {
    //debugger;
    try {
        const response = await fetch(link, {
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

//API GET
async function getCarsForDropdown() {
    //debugger;
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
async function getModelsForDropdown(marcaId) {
    //debugger;
    try {
        const response = await fetch(`${API_BASE_URL}/Cars/getModels?marcaId=${marcaId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const models = await response.json();
        populateModelsDropdown(models);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului pentru modele:', error);
    }
}
async function getGeneratiiForDropdown(modelId) {
    try {
        const response = await fetch(`${API_BASE_URL}/Cars/getGeneratie?modelId=${modelId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const generatii = await response.json();
        populateGeneratiiDropdown(generatii);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului pentru generații:', error);
    }
}

//POPULATE OTHERS
function populateCombustibilDropdown() {
    const url = '${API_BASE_URL}/InfoCars/GetCombustibil';
    
    return fetch(url) // Returnează promisiunea
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de combustibil');
            }
            return response.json();
        })
        .then(data => {
            const combustibilDropdown = document.getElementById('ddd_combustibil');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeCombustibil;
                combustibilDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_combustibil').innerText = 'A apărut o eroare la încărcarea datelor de combustibil.';
        });
}
function populateTractiuneDropdown() {
    debugger;
    const url = '${API_BASE_URL}/InfoCars/GetTractiune';
    
    return fetch(url) // Returnează promisiunea
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de tracțiune');
            }
            return response.json();
        })
        .then(data => {
            const tractiuneDropdown = document.getElementById('ddd_Tractiune');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeTractiune;
                tractiuneDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_Tractiune').innerText = 'A apărut o eroare la încărcarea datelor de tracțiune.';
        });
}
function populateTipCutieDropdown() {
    const url = '${API_BASE_URL}/InfoCars/GetTipCutieViteze'; // Presupunem că acesta este endpoint-ul pentru tipul de cutie viteze
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de tip cutie viteze');
            }
            return response.json();
        })
        .then(data => {
            const tipCutieDropdown = document.getElementById('ddd_tipCutie');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeCutieViteze; // Presupunem că acesta este câmpul pentru numele tipului de cutie
                tipCutieDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_tipCutie').innerText = 'A apărut o eroare la încărcarea datelor de tip cutie viteze.';
        });
}
function populateCuloareDropdown() {
    debugger;
    const url = '${API_BASE_URL}/InfoCars/GetCuloare'; // Presupunem că acesta este endpoint-ul pentru culori
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de culoare');
            }
            return response.json();
        })
        .then(data => {
            const culoareDropdown = document.getElementById('ddd_culoare');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeCuloare; // Presupunem că acesta este câmpul pentru numele culorii
                culoareDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_culoare').innerText = 'A apărut o eroare la încărcarea datelor de culoare.';
        });
}
function populateTipCaroserieDropdown() {
    //debugger;
    const url = '${API_BASE_URL}/InfoCars/GetTipCaroserie'; 
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de Tip Caroserie');
            }
            return response.json();
        })
        .then(data => {
            const tipCaroserieDropdown = document.getElementById('ddd_TipCaroserie');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.tipRO; // Presupunem că acesta este câmpul pentru numele culorii
                tipCaroserieDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_TipCaroserie').innerText = 'A apărut o eroare la încărcarea datelor de tip caroserie.';
        });
}


//OTHERS
function showInsertSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Insert operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
function showUpdateSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Update operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
function renunta(){
    window.close();
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function showErrorMessage(errorMessage) {
    Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
