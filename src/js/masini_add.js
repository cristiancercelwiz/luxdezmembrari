﻿//PAGE LOAD
document.addEventListener('DOMContentLoaded', async  () => {
    await getCarsForDropdown();   
    await fetchAndPopulateCarData(); 
    populatePieseMasiniTable()
});


function populatePieseMasiniTable() {
    const carId = getQueryParam('id');
    const url = '${API_BASE_URL}/InfoCars/GetById?IdMasina=' + carId;
        
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

            data.forEach(piesa => {
                const piesaRow = `
                    <tr data-id="${piesa.idPiesa}">
                        <td>${piesa.idPiesa}</td>
                        <td>${piesa.nume}</td>
                        <td>${piesa.nrOrdine}</td>
                        <td>${piesa.stoc}</td>
                        <td>${piesa.vandut}</td>
                        <td>${piesa.stoc - piesa.vandut}</td>
                        <td>${piesa.pret}</td>
                        <td>${piesa.discount}</td>
                        <td>${calculatePretVanzare(piesa.pret, piesa.discount)}</td>
                        <td>${piesa.autovit}</td>
                         <td>
                            <button class="edit-button" data-id="${piesa.idPiesa}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                        </td>
                    </tr>
                `;
                rezultateTable.innerHTML += piesaRow;
            });

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
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la obținerea pieselor auto.';
        });
}

async function get_details(id) {
    debugger;    
    if (id) {

        const url = `piese_add.html?id=${id}`;
        window.open(url, '_blank');

    } else {
        
    }
}

function calculatePretVanzare(pret, discount) {
    if (!discount || discount === "0") {
        return pret;
    }
    const pretFloat = parseFloat(pret);
    const discountFloat = parseFloat(discount);
    return (pretFloat - (pretFloat * (discountFloat / 100))).toFixed(2);
}


async function fetchAndPopulateCarData() {
    debugger;
    const carId = getQueryParam('id');
    populateDefaultFields();
    if (!carId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/CarsRegister/${carId}`);
        if (!response.ok) {
            throw new Error('Eroare la obținerea datelor');
        }
        const data = await response.json();
        populateOtherFields(data);                
        const brandName = extractCarBrand(data.nume); // Extrage brand-ul                      
        const brandDropdown = document.getElementById('ddd_cars');
        const brandOption = Array.from(brandDropdown.options).find(option => option.text === brandName);
        const brandId = brandOption ? brandOption.value : null;                 
        if (brandId) {            
            await setSelectedValue('ddd_cars', brandName); // Setează brand-ul selectat      
            await getModelsForDropdown(brandId); // Populează modelele cu ID-ul brand-ului                       
            var modelName = await extractCarModel(data.nume, brandName);          
            const modelDropdown = document.getElementById('ddd_models');
            const modelOption = Array.from(modelDropdown.options).find(option => option.text === modelName);
            const modelId = modelOption ? modelOption.value : null;
            debugger;
            if (modelId) {
                await setSelectedValue('ddd_models', modelName); // Setează modelul selectat
                await getGeneratiiForDropdown(modelId);    
                var generatieName = await  extractCarGeneratie(data.nume, modelName);                                     
                const generatieDropdown = document.getElementById('ddd_generatii');
                const generatieOption = Array.from(generatieDropdown.options).find(option => option.text === generatieName);
                if (generatieOption) {
                    await setSelectedValue('ddd_generatii', generatieName); // Setează generația selectată
                } else {
                    console.error('Generația nu a fost găsită.');
                }                            
            } else {
                console.error('Modelul nu a fost găsit.');
            } 
        }                
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la obținerea datelor mașinii.');
    }
}


async function  populateDefaultFields() {
    await populateCombustibilDropdown(); // Populează combustibil
    await populateTipCutieDropdown(); // Populează tip cutie viteze
    await populateTractiuneDropdown(); // Populează tracțiune
    await populateCuloareDropdown(); // Populează coloare
}

async function populateOtherFields(data) {
      
    // Populează restul câmpurilor
    document.getElementById('tb_nrOrdine').value = data.nrOrdine || '';
    document.getElementById('tb_an').value = data.an || '';      
    await setSelectedValue('ddd_combustibil', data.combustibil);             
    await setSelectedValue('ddd_Tractiune', data.tractiune);   
    await setSelectedValue('ddd_tipCutie', data.transmisie);  
    await setSelectedValue('ddd_culoare', data.culoare);
    await setSelectedValue('ddd_vizibil', data.vizibilitate);
    document.getElementById('tb_sku').value = data.skU_ID || '';
    document.getElementById('tb_discount').value = data.discount || '';
    document.getElementById('tb_nrPiese').value = data.nrPiese || '';    
    document.getElementById('tb_utl').value = data.utl || ''; 
    document.getElementById('tb_detalii').value = data.detalii || ''; 
    document.getElementById('tb_codMotor').value = data.codMotor || ''; 
    document.getElementById('tb_vin').value = data.vin || ''; 
    document.getElementById('tb_km').value = data.km || ''; 
    document.getElementById('tb_capCil').value = data.capacitCil || ''; 
    document.getElementById('tb_nrLocuri').value = data.nrLocuri || ''; 
    document.getElementById('tb_nrUsi').value = data.nrUsi || ''; 
    document.getElementById('tb_nrViteze').value = data.nrViteze || ''; 
    document.getElementById('tb_alteDetalii').value = data.alteDetaliiTrans || ''; 
}

function extractGeneratie(nume) {
    // Expresie regulată pentru a găsi generația în paranteze rotunde
    const generatiePattern = /\b([^\(]+\([^\)]+\)\s*\([^\)]+\))/;
    const match = nume.match(generatiePattern);
    if (match) {
        return match[0];
    }
    return null;
}

function verificare(){
    //debugger;
    verif = true;
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;    
    if(marcaText == "Marca"){
        verif = false;
        verifRed(marca.id);
    }    
    else if(modelText == "Model"){
        verif = false;
        verifRed(model.id);
    }  
    else if(generText == "Generație"){
        verif = false;
        verifRed(gener.id);
    }            
    return verif;
}
function verifRed(controlId) {
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.add('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}
function verifRemoveRed(controlId){
    debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.remove('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}

function registerPiesaCar() {
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;    
    var nume = document.getElementById('tb_numePiesa').value;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;  
    var codPiesa = document.getElementById('tb_numePiesa').value;
    //var valuta = document.getElementById("ddd_valuta");
    var valutaText= "RON";
    var pret = document.getElementById('tb_pret').value;
    //var um = document.getElementById('tb_um').value;  
    var discount = document.getElementById('tb_discount').value;
    var locatie = document.getElementById('tb_locatie').value;
    var stoc = document.getElementById('tb_stoc').value || -1;    
    var vandut = 0  
    var vizibil= document.getElementById("ddd_vizibil");
    var vizibilText= vizibil.options[vizibil.selectedIndex].text;
    var skU_ID = document.getElementById('tb_sku').value || -1;       
    var utl = document.getElementById('tb_utl').value;                                   
    const piesa = {
        masina: numeCar,
        nume: nume,
        codPiesa: codPiesa,
        tipCaroserie: tipCaroserieText,
        pret: pret + " " + valutaText,
        um: um,
        discount: discount,
        locatie: locatie,
        stoc: stoc,
        vandut: vandut,
        vizibilitate: vizibilText,
        skU_Id: skU_ID,
        utl: utl                
    };
    debugger;
    const piesaId = getQueryParam('id');
    insert(piesa,'${API_BASE_URL}/Piese');            
}

//Add masina
function registerCar() {    
    debugger;
     if(verificare() == false){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;
    var combustibil = document.getElementById("ddd_combustibil");
    var combustibilText= combustibil.options[combustibil.selectedIndex].text;    
    var tractiune = document.getElementById("ddd_Tractiune");
    var tractiuneText= tractiune.options[tractiune.selectedIndex].text;    
    var tipCutie = document.getElementById("ddd_tipCutie");
    var tipCutieText= tipCutie.options[tipCutie.selectedIndex].text;
    var nrOrdine = parseInt(document.getElementById('tb_nrOrdine').value, 10);
    var an = parseInt(document.getElementById('tb_an').value, 10)  || -1;    
    var skU_ID = document.getElementById('tb_sku').value; 
    var discount = document.getElementById('tb_discount').value  || -1;
    var nrPiese = parseInt(document.getElementById('tb_nrPiese').value, 10)  || -1;
    var utl = document.getElementById('tb_utl').value;
    var km = document.getElementById('tb_km').value  || -1;
    var detalii = document.getElementById('tb_detalii').value;
    var codMotor = document.getElementById('tb_codMotor').value;
    var vin = document.getElementById('tb_vin').value;
    var capCil = document.getElementById('tb_capCil').value  || -1;    
    var putere = document.getElementById('tb_putere').value  || -1;
    var nrLocuri = document.getElementById('tb_nrLocuri').value  || -1;
    var nrUsi = document.getElementById('tb_nrUsi').value  || -1;
    var alteDetalii = document.getElementById('tb_alteDetalii').value;
    var culoare = document.getElementById("ddd_culoare");
    var culoareText= culoare.options[culoare.selectedIndex].text; 
    var nrViteze = document.getElementById('tb_nrViteze').value  || -1;
     var vizibil= document.getElementById("ddd_vizibil");
     var vizibilText= vizibil.options[vizibil.selectedIndex].text;
    const data = {
        nume: numeCar,
        nrOrdine: nrOrdine,
        an: an,
        km: km,
        combustibil: combustibilText,
        tractiune: tractiuneText,
        transmisie: tipCutieText,
        skU_ID: skU_ID,        
        nrPiese: nrPiese,
        vizibilitate: vizibilText,        
        status: "",
        images: "",
        autovit: "",
        utl: utl,
        detalii: detalii,
        codMotor: codMotor,
        vin: vin,
        capacitCil: capCil,
        putere: putere,
        nrLocuri: nrLocuri,
        nrUsi: nrUsi,
        alteDetaliiTrans: alteDetalii,
        culoare: culoareText,
        discount: discount,
        nrViteze: nrViteze
    };
    debugger;
    const carId = getQueryParam('id');
    if(carId != null){
        update(carId, data, `${API_BASE_URL}/CarsRegister/${carId}`)        
    }  
    else{
        insert(data,'${API_BASE_URL}/CarsRegister');    
    }        
}

//Add masina
async function registerPiesaMasina() {
    debugger;
    var marca = document.getElementById("ddd_cars");
    var marcaText = marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText = model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText = gener.options[gener.selectedIndex].text;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;
    var nume = document.getElementById('tb_numePiesa').value || -1;
    var codPiesa = document.getElementById('tb_codPiesa').value;
    var pret = document.getElementById('tb_pret').value;
    var valuta = document.getElementById("ddd_valuta");
    var valutaText = valuta.options[valuta.selectedIndex].text;
    var discount = document.getElementById('tb_discount').value;
    var locatie = document.getElementById('tb_locatie').value;
    var stoc = document.getElementById('tb_stoc').value || -1;
    var vizibil = document.getElementById("ddd_vizibil");
    var vizibilText = vizibil.options[vizibil.selectedIndex].text;
    var skU_ID = document.getElementById('tb_sku').value || -1;

    const data = {
        masina: numeCar,
        nume: nume,
        codPiesa: codPiesa,
        pret: pret + " " + valutaText,
        discount: discount,
        locatie: locatie,
        stoc: stoc,
        vandut: 0,
        vizibilitate: vizibilText,
        skU_Id: skU_ID,
    };

    try {
        const carData = await insert(data, '${API_BASE_URL}/Piese');
        const masinaId = getQueryParam('id');
        const piesaMasina = {
            IdMasina: masinaId,
            IdPiesa: carData.id
        };

        await insert(piesaMasina, '${API_BASE_URL}/InfoCars');
        populatePieseMasiniTable();
        console.log('Inserare reușită pentru piesa:', carData);
    } catch (error) {
        console.error('A apărut o eroare:', error);
    }
}



/* tabs */
function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab-button").click();
});