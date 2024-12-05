//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
let currentPage = 1;
let totalPages = 1;
let pageSize = 24; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare
let marca = "";
let model = "";
let generatie = "";
let allMarci = [];
let allModels = [];
let allGeneratii = []


// Apelează funcția pentru a popula checkbox-urile pentru mărci când pagina se încarcă
document.addEventListener('DOMContentLoaded', getCarsForDropdown);
//
document.addEventListener('DOMContentLoaded', async  () => {
    //debugger;    
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    
    pieseApiCall()
        .then(data => {                
            populateShopGrid(data);
    })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
    });     
});

//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */

document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină

 /*    const selMarca = document.getElementById("ddd_cars");
    selMarca.value = "";
    const selModel = document.getElementById("ddd_models");
    selModel.value = "";
    const selGeneratie = document.getElementById("ddd_generatii");
    selGeneratie.value = "";
 */
    pieseApiCall()
    .then(data => {                
        populateShopGrid(data);
})
    .catch(error => {
        console.error('Eroare la obținerea datelor:', error);
});   
       
});
document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        debugger;
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină

   /*      const selMarca = document.getElementById("ddd_cars");
        selMarca.value = "";
        const selModel = document.getElementById("ddd_models");
        selModel.value = "";
        const selGeneratie = document.getElementById("ddd_generatii");
        selGeneratie.value = ""; */
    

        pieseApiCall()
        .then(data => {                
            populateShopGrid(data);
    })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
    });       
    }
});


//**********  API ********************************************************************* */
//**********  API ********************************************************************* */
//**********  API ********************************************************************* */
//**********  API ********************************************************************* */

//API GET DATE
function pieseApiCall() {
    //debugger;
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
 
     return fetch(url)
         .then(response => {
             if (!response.ok) {
                 throw new Error('Eroare la obținerea datelor');
             }
             return response.json();
         })
         .then(data => {
            //debugger;
             Swal.close(); // Ascunde loaderul la succes
             return data;
         })
         .catch(error => {            
             document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
             Swal.close(); // Ascunde loaderul la eroare
             throw error;
         });
 }
 //POPULATE GRID
 function populateShopGrid(data){
    const rezultateDiv = document.getElementById('rezultate');
    rezultateDiv.innerHTML = '';
    debugger;
    //cristi testache
    data.piese.forEach(piesa => {
        debugger;
        const imageSrc = piesa.imagini ? 'https://localhost:7216/uploads/' + piesa.imagini : 'images/placeholder.jpg';
        const inStock = piesa.stoc > 0;
        const cartImageStyles = inStock 
        ? "width: 34px; height: 34px; background: linear-gradient(to right, #1b78d1, #3098fa); padding: 8px; border-radius: 15%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: box-shadow 0.3s ease, transform 0.3s ease;"
        : "width: 34px; height: 34px; background: grey; padding: 8px; border-radius: 15%;";
    
        const cartImageEvents = inStock 
        ? `
            onmouseover="this.style.background='linear-gradient(to right, #368ddf, #4ca8ff)'" 
            onmouseout="this.style.background='linear-gradient(to right, #1b78d1, #3098fa)'" 
            onmousedown="this.style.boxShadow='none'; this.style.transform='scale(0.95)'" 
            onmouseup="this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'; this.style.transform='scale(1)'" 
            onclick="onImageClick(${piesa.id})"
        `
        : `
            onclick="event.preventDefault();"
        `;

        const piesaHTML = `
            <div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up">
                <div class="block-4 border d-flex flex-column" style="height: 450px;">
                    <figure class="block-4-image">
                        <a href="shop-single.html?idP=${piesa.id}">                        
                        <img src="${imageSrc}" style='width: 100%; height: 165px; object-fit: fit;object-position: center;' alt="Image placeholder" class="img-fluid" id="piesaImagine-${piesa.id}">
                        </a>
                    </figure>
                        <div class="block-4-text p-4 d-flex flex-column flex-grow-1" id="piesa-${piesa.id}">
                        <h6><a target='_blank' href="shop-single.html?id=${piesa.id}&masina=${piesa.masina}" id="piesaTitlu-${piesa.id}">${piesa.nume}</a></h6>
                        <p class="mb-0"><strong style='font-weight: bold'>Masina: </strong> <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                        <p class="mb-0"><strong style='font-weight: bold'>Disponibilitate: </strong> ${piesa.stoc > 0 ? `În stoc (${piesa.stoc})` : 'Fără stoc'}</p>
                        <p class="mb-0" style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                        <p class="mb-0"><strong style='font-weight: bold; display:none'>Tip caroserie: </strong><span style='display:none' id="piesaTipCaroserie-${piesa.id}">${piesa.tipCaroserie}</span></p>
                        
                        <p class="mb-0"><strong style='font-weight: bold'>Cod intern: </strong><span id="piesaCodintern-${piesa.id}">${piesa.skU_Id}</span></p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <h3 style="margin: 0;" id="piesaPret-${piesa.id}"><strong style='font-weight: bold; color:'>${piesa.pret}</strong></h3>
                            <a href="cart.html" class="site-cart">
                                <img 
                                    src='images/add-to-cart.png' 
                                    alt="Image placeholder" 
                                    class="img-fluid" 
                                    style="${cartImageStyles}"
                                    ${cartImageEvents}
                                > 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rezultateDiv.innerHTML += piesaHTML;                
     });             
    totalPages = data.totalPages; // Actualizează totalPages
    updatePaginationControls(); // Actualizează controalele de paginare

    // Adaugă eveniment pentru butoanele de editare
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            debugger;
            get_details(id); // Apelează funcția pentru a obține detaliile
        });
    });
     // Întârzierea închiderii loader-ului
     setTimeout(() => {
        Swal.close(); // Închide loader-ul
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)
}

function onImageClick(idPiesa) {
    debugger;
    var pretText = document.getElementById(`piesaPret-${idPiesa}`).innerText;
    var pret = parseInt(pretText.match(/\d+/)[0]); // Extrage doar numărul din text        
    var imagini = document.getElementById(`piesaImagine-${idPiesa}`).src;
    var masina = document.getElementById(`piesaMasina-${idPiesa}`).innerText;
    var tipCaroserie = document.getElementById(`piesaTipCaroserie-${idPiesa}`).innerText;
    var codIntern = document.getElementById(`piesaCodintern-${idPiesa}`).innerText;
    var stoc = document.getElementById(`piesaStoc-${idPiesa}`).innerText;

    if(idPiesa){
        const product = {
            id: idPiesa.toString(),
            name: document.getElementById(`piesaTitlu-${idPiesa}`).innerText,
            quantity: 1,
            pret: pret,
            pretTotal: pret,
            imagini: imagini,
            masina: masina,
            tipCaroserie: tipCaroserie,
            codIntern: codIntern,
            stoc: stoc
        };
        addToCart(product);
    }
}


 // Funcția API GET DATE pentru a căuta piese după Marca, Model și Generatie
 function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    debugger;    
    const url = `${API_BASE_URL}/Piese/search_fields?Marca=${encodeURIComponent(marca)}&Model=${encodeURIComponent(model)}&Generatie=${encodeURIComponent(generatie)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;

    // Afișează loaderul
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            debugger;
            Swal.close(); // Ascunde loaderul la succes
            return data; // Returnează datele primite de la API
        })
        .catch(error => {            
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
            Swal.close(); // Ascunde loaderul la eroare
            throw error;
        });
}



//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */

function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}
function changePage(delta) {
   debugger;
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        
        populateApiPath();
      
        
        
                 
    }
}
function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    populateApiPath();

}
function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;  
    populateApiPath();

}

function populateApiPath(){
        if(marca == "" && model == "" && generatie == ""){
            pieseApiCall()
            .then(data => {                
                populateShopGrid(data);
            })
            .catch(error => {
                console.error('Eroare la obținerea datelor:', error);
            });  
        }
        else{
            pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
            .then(data => {                
                populateShopGrid(data);
            })
                .catch(error => {
                    console.error('Eroare la obținerea datelor:', error);
            });     
        } 

        
       
    
}


//**********  MASINI ********************************************************************* */
//**********  MASINI ********************************************************************* */
//**********  MASINI ********************************************************************* */
//**********  MASINI ********************************************************************* */

//API
async function getCarsForDropdown() {
    try {
        const response = await fetch('${API_BASE_URL}/Cars/get', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cars = await response.json();
        populateCheckboxesMarca(cars);
        
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
function populateCheckboxesMarca(cars) {
    //debugger;
    allMarci = cars;
    const container = document.getElementById('checkboxContainerMarca');
    container.innerHTML = ''; // Golește containerul înainte de a adăuga noile checkbox-uri

    cars.forEach(car => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `marca_${car.marcaID}`; // Asigură-te că fiecare checkbox are un ID unic
        checkbox.value = car.marcaID; // ID-ul mărcii
        checkbox.addEventListener('change', function() {
            handleMarcaChange(this);
        });

        const label = document.createElement('label');
        label.htmlFor = `marca_${car.marcaID}`;
        label.textContent = car.marcaName;
        label.style.fontWeight = 'bold'; 
        label.style.color = '#007bff'; 
        label.style.marginLeft = '5px';                     
        label.style.fontSize = '15px';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        container.appendChild(checkboxWrapper);
    });
}
function handleMarcaChange(checkbox) {
    currentPage = 1;
    marca = checkbox.checked ? checkbox.nextSibling.textContent : "";
    const marcaId = checkbox.value;
    document.getElementById('tb_cauta').value = "";
    
    debugger;
    if (checkbox.checked) {
        // Golește lista de mărci și păstrează doar marca selectată
        const container = document.getElementById('checkboxContainerMarca');
        container.innerHTML = '';

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        container.appendChild(checkboxWrapper);

        // Obține modelele pentru marca selectată
        getModelsForDropdown(marcaId);
    } else {
        // Restaurează lista completă de mărci
        restoreMarcaCheckboxes();

        const container = document.getElementById('checkboxContainerModel');
        container.innerHTML = ''; 
        const containerg = document.getElementById('checkboxContainerGeneratie');
        containerg.innerHTML = ''; 
    }

    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });
}
function restoreMarcaCheckboxes() {
    populateCheckboxesMarca(allMarci);
}





//API
async function getModelsForDropdown(marcaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/Cars/getModels?marcaId=${marcaId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const models = await response.json();
        populateCheckboxesModel(models);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului pentru modele:', error);
    }
}
function populateCheckboxesModel(models) {
    allModels = models;
    const container = document.getElementById('checkboxContainerModel');
    container.innerHTML = ''; // Golește containerul înainte de a adăuga noile checkbox-uri

    models.forEach(model => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `model_${model.modelID}`; // Asigură-te că fiecare checkbox are un ID unic
        checkbox.value = model.modelID; // ID-ul modelului
        checkbox.addEventListener('change', function() {
            handleModelChange(this);
        });

        const label = document.createElement('label');
        label.htmlFor = `model_${model.modelID}`;
        label.textContent = model.modelName;
        label.style.fontWeight = 'bold'; 
        label.style.color = '#007bff'; 
        label.style.marginLeft = '5px';                     
        label.style.fontSize = '15px';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        container.appendChild(checkboxWrapper);
    });
}
function handleModelChange(checkbox) {
    currentPage = 1;
    model = checkbox.checked ? checkbox.nextSibling.textContent : "";
    const modelId = checkbox.value;
    document.getElementById('tb_cauta').value = "";

    debugger;
    if (checkbox.checked) {
        // Golește lista de modele și păstrează doar modelul selectat
        const container = document.getElementById('checkboxContainerModel');
        container.innerHTML = '';

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        container.appendChild(checkboxWrapper);

        // Obține generațiile pentru modelul selectat
        getGeneratiiForDropdown(modelId);
    } else {
        // Restaurează lista completă de modele
        restoreModelCheckboxes();
        const containerg = document.getElementById('checkboxContainerGeneratie');
        containerg.innerHTML = ''; 
    }

    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });
}
function restoreModelCheckboxes() {
    populateCheckboxesModel(allModels);
}




//API
async function getGeneratiiForDropdown(modelId) {
    try {
        const response = await fetch(`${API_BASE_URL}/Cars/getGeneratie?modelId=${modelId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const generatii = await response.json();
        populateCheckboxesGeneratie(generatii);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului pentru generații:', error);
    }
}
function populateCheckboxesGeneratie(generatii) {
    debugger;
    allGeneratii = generatii;
    const container = document.getElementById('checkboxContainerGeneratie');
    container.innerHTML = ''; // Golește containerul înainte de a adăuga noile checkbox-uri

    generatii.forEach(generatie => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `generatie_${generatie.generatieID}`; // Asigură-te că fiecare checkbox are un ID unic
        checkbox.value = generatie.generatieID; // ID-ul generației
        checkbox.addEventListener('change', function() {
            handleGeneratieChange(this);
        });

        const label = document.createElement('label');
        label.htmlFor = `generatie_${generatie.generatieID}`;
        label.textContent = generatie.generatieName;
        label.style.fontWeight = 'bold'; 
        label.style.color = '#007bff'; 
        label.style.marginLeft = '5px';                     
        label.style.fontSize = '15px';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        container.appendChild(checkboxWrapper);
    });
}
function handleGeneratieChange(checkbox) {
    currentPage = 1;
    generatie = checkbox.checked ? checkbox.nextSibling.textContent : "";
    const generatieId = checkbox.value;
    document.getElementById('tb_cauta').value = "";

    debugger;
    if (checkbox.checked) {
        // Golește lista de generații și păstrează doar generația selectată
        const container = document.getElementById('checkboxContainerGeneratie');
        container.innerHTML = '';

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        container.appendChild(checkboxWrapper);

    } else {
        // Restaurează lista completă de generații
        restoreGeneratieCheckboxes();
    }

    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });
}
function restoreGeneratieCheckboxes() {
    populateCheckboxesGeneratie(allGeneratii);
}










