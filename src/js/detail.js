//PAGE LOAD

document.addEventListener('DOMContentLoaded', function () {
    debugger;
    loadPiesa();
    
});


const urlParams = new URLSearchParams(window.location.search);
const piesaId = urlParams.get('id');
const masina = urlParams.get('masina');


function loadPiesa(){
     // Preluăm ID-ul din URL
     

     // Verificăm dacă ID-ul există
     if (piesaId) {
         const url = `${API_BASE_URL}/Piese/${piesaId}`;
 
         fetch(url)
             .then(response => {
                 if (!response.ok) {
                     throw new Error('Eroare la obținerea detaliilor piesei');
                 }
                 return response.json();
             })
             .then(obj => {                  
             
                var piesa = obj.piesa;
                if(piesa.stoc == 0)
                {                    
                    disableAddToCart();                   
                }
                debugger;
                 //var img = obj.piesa.imagini == null || obj.piesa.imagini == "" ? 'images/placeholder.jpg' : obj.piesa.imagini; 
                 //img.src = `https://localhost:7216/uploads/${image.denumireImagine}`; // Aceasta este calea corecta

                 var img = obj.piesa.imagini == null || obj.piesa.imagini == "" ? 'images/placeholder.jpg' : 'https://localhost:7216/uploads/' + obj.piesa.imagini; 
                 
                 document.getElementById('piesaTitlu').innerText = piesa.nume + " " + masina;
                 document.getElementById('piesaMeniu').innerText = piesa.nume;
                 document.getElementById('piesaMasina').innerText = masina;                 
                 //document.getElementById('piesaImagine').src = `https://localhost:7216/uploads/${img}`
                 document.getElementById('piesaImagine').src = img;
                 document.getElementById('piesaBucati').innerText = piesa.stoc;
                 document.getElementById('piesatipCaroserie').innerText = piesa.tipCaroserie;
 
                 document.getElementById('piesaCodPiesa').innerText = piesa.codPiesa;
                                 
                 document.getElementById('piesaPret').innerText = `${piesa.pret}`;

                 //document.getElementById('piesaPretTotal').innerText = `${piesa.pret}`;
             })
             .catch(error => {
                 console.error('Eroare:', error);
                 document.getElementById('detaliiPiesa').innerText = 'A apărut o eroare la încărcarea detaliilor piesei.';
             });
     } else {
         // Dacă nu există ID în URL, afișează un mesaj de eroare
         document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
     }

}



  // Adaugă evenimentele de click după ce elementele au fost adăugate în DOM
  document.querySelectorAll('.js-btn-minus, .js-btn-plus').forEach(button => {        
    button.addEventListener('click', function() {    
        debugger;    
        const action = this.getAttribute('data-action');                        
        updateQuantity(action);        
    });
});


function updateQuantity(action){
    debugger;
    var count = parseInt(document.getElementById('quantity-input').value);
    if(action == 'plus')
    {
        count++;
    }
    else if (count > 1){
        count--;
    }
    
    var pret = parseInt(document.getElementById('piesaPret').innerText); 
    var total = count * pret;
    
    document.getElementById('piesaPretTotal').innerText = total + " RON";
}

document.getElementById('addToCart').addEventListener('click', () => {
    debugger;        
    
    var pretText = document.getElementById('piesaPret').innerText;
    var pret = parseInt(pretText.substring(0, pretText.indexOf(' ')));        
    var pretTotal = pret;    
    var imagini = document.getElementById('piesaImagine').src;
    var masina = document.getElementById('piesaMasina').innerText;
    var tipCaroserie = document.getElementById('piesatipCaroserie').innerText;
    var codIntern = document.getElementById('piesaCodPiesa').innerText;
    var stoc = document.getElementById('piesaBucati').innerText;

    if(piesaId){
        const product = {
            id: piesaId,
            name: document.getElementById('piesaTitlu').innerText,            
            quantity: 1,
            pret: pret,
            pretTotal: pretTotal,
            imagini: imagini,
            masina: masina,
            tipCaroserie: tipCaroserie,
            codIntern,
            stoc: stoc
        };
        addToCart(product);    
    }        
});

 
function disableAddToCart() {
    const addToCartLink = document.getElementById('addToCart');
    addToCartLink.classList.add('disabled-link');
    addToCartLink.removeAttribute('href');  // Oprirea navigării la pagină
}


