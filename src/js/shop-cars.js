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

//
document.addEventListener('DOMContentLoaded', async  () => {
    debugger;    
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    await getCarsForDropdown();  
    
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

    const selMarca = document.getElementById("ddd_cars");
    selMarca.value = "";
    const selModel = document.getElementById("ddd_models");
    selModel.value = "";
    const selGeneratie = document.getElementById("ddd_generatii");
    selGeneratie.value = "";

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
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină

        const selMarca = document.getElementById("ddd_cars");
        selMarca.value = "";
        const selModel = document.getElementById("ddd_models");
        selModel.value = "";
        const selGeneratie = document.getElementById("ddd_generatii");
        selGeneratie.value = "";
    

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

    data.piese.forEach(piesa => {
         const piesaHTML = `
             <div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up">
                 <div style="height: 450px" class="block-4 border">
                     <figure class="block-4-image">
                         <a href="shop-single.html?idP=${piesa.id}"><img src="${piesa.imagini}" alt="Image placeholder" class="img-fluid"></a>
                     </figure>
                     <div class="block-4-text p-4">
                         <h3><a href="shop-single.html?id=${piesa.id}">${piesa.nume}</a></h3>
                         <p class="mb-0">Marca: ${piesa.masina}</p>                         
                         <p class="mb-0">Nume: ${piesa.nume}</p>    
                         <p class="mb-0">Tip caroserie: ${piesa.tipCaroserie}</p>    
                         <p class="mb-0">Discount: ${piesa.discount}</p>                              
                         <p class="text-primary font-weight-bold">${piesa.pret} RON</p>
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
            get_details(id); // Apelează funcția pentru a obține detaliile
        });
    });



    //Swal.close();

     // Întârzierea închiderii loader-ului
     setTimeout(() => {
        Swal.close(); // Închide loader-ul
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)


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
//DROP DOWN
function populateDropdown(cars) {
    //debugger;
    const dropdown = document.getElementById('ddd_cars');
    dropdown.innerHTML = '<option value="">Marca</option>';

    // Adaugă opțiunile din lista de mașini
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.marcaID; // `id` corespunde `Id` din C#
        option.text = car.marcaName; // `f2` corespunde `F2` din C#
        dropdown.appendChild(option);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

}
//EVENT
document.getElementById('ddd_cars').addEventListener('change', function() {
    debugger;
    currentPage = 1;
    marca = this.selectedOptions[0].text == "Marca" ? "" : this.selectedOptions[0].text;
    const marcaId = this.value;
    document.getElementById('tb_cauta').value = "";    
    if (marcaId) {
        getModelsForDropdown(marcaId);
    } else {
        // Curăță dropdown-ul de modele dacă nu este selectată nicio marcă
        document.getElementById('ddd_models').innerHTML = '<option value="">Model</option>';
    }
 
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
    })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
    });     
});


//**********  MODELE ********************************************************************* */
//API
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
//DROP DOWN
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
//EVENT
document.getElementById('ddd_models').addEventListener('change', function() {
    debugger;
    currentPage = 1;
    model = this.selectedOptions[0].text == "Model" ? "" : this.selectedOptions[0].text;
    const modelId = this.value;
    document.getElementById('tb_cauta').value = "";
    if (modelId) {
        getGeneratiiForDropdown(modelId);
    } else {
        // Curăță dropdown-ul de generații dacă nu este selectat niciun model
        document.getElementById('ddd_generatii').innerHTML = '<option value="">Generație</option>';
    }    
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
    .then(data => {                
            populateShopGrid(data);
    })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
    });   
    
});


//**********  GENERATII ********************************************************************* */

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
        populateGeneratiiDropdown(generatii);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului pentru generații:', error);
    }
}
//DROP DOWN
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
document.getElementById('ddd_generatii').addEventListener('change', function() {
    debugger;   
    currentPage = 1;      
    generatie = this.selectedOptions[0].text == "Generație" ? "" : this.selectedOptions[0].text ;
    document.getElementById('tb_cauta').value = "";
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
    .then(data => {                
        populateShopGrid(data);
    })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
    });   
        

});


