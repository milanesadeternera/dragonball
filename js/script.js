URL="https://dragonball-api.com/api/characters"
//URL="data.json"
let personajes = [];

document.addEventListener("DOMContentLoaded",async ()=>{
    document.getElementById("buscar").addEventListener("click", buscar);
    document.getElementById("history").addEventListener("click", history);

    //cargo los personajes
    let fin = false;   
    while(!fin){
        let datos = await getJSONData(URL);
        personajes = personajes.concat(datos.data.items);
        if(datos.data.links.next!=""){
            //faltan paginas
            URL=datos.data.links.next;
        }else{
            //ultima pagina
            fin=true
        }
    }
    displayData(personajes);
    console.log(personajes);
});

function displayData(values, insert=true){
    //funcion para mostrar los personajes
    //contiene inser, para recuperar codigo sin insertar.
    console.log(values);
    let contenedor=document.getElementById("contenedor");
    data="";
    values.forEach(element => {
        data +=`<div id=${element.id} class="card col-md-3 mt-3" onclick="detail(${element.id})">
                        <div class="card-body">
                            <div class="image-container img-thumbnail mb-1">
                                <img class="image" src=${element.image}></image>
                            </div>
                            <h4 class="card-title fw-bold">${element.name}</h4>
                            <p class="card-text descripcion">${element.description}</p>
                        </div>
                    </div>`

    });
    if(insert == false){
        return data;
    }else{
        contenedor.innerHTML=data;
    }
}

function createHtml(values){
    //console.log(values);
    data="";
    values.forEach(element => {
        data +=`<div id=${element.id} class="card col-md-3 mt-3" >
                    <div class="card-body">
                        <div class="image-container img-thumbnail mb-1">
                            <img class="image" src=${element.image}></image>
                        </div>
                        <h4 class="card-title fw-bold">${element.name}</h4>
                        <p class="card-text descripcion">${element.description}</p>
                    </div>
                </div>`
    //}

    });
    return data;
}

function buscar(){
//Funcion buscar personaje
    let patron = document.getElementById("buscar-palabra").value;
    let elementos = document.getElementsByClassName("card");
    if(patron != "" ){
        //Busco nombre de personaje
        let match = personajes.filter(personaje => !personaje.name.toLocaleLowerCase().search(patron.toLocaleLowerCase())).map(personaje => personaje.id);
        for(let elemento of elementos){
            if(!match.includes(parseInt(elemento.id))){
                //no esta en el match
                elemento.style.display="none";
            }else{
                elemento.style.display="";
            }
        }

        //guardo historial
        let data = getUserData();
        data.push(patron);
        setUserData(data);

        //personajes relacionados
        relatedSearch(patron);
    }else{
        //No ingresó busqueda, se muestra todo.
        for(let elemento of elementos){
            elemento.style.display="";
        }
        //se oculta personajes relacionados.
        document.getElementById("related").innerHTML="";
    }
}

function relatedSearch(patron){
    let related = personajes.filter(personaje => personaje.description.toLowerCase().includes(patron.toLowerCase()));
    console.log("related:");
    console.log(related);
    let content ="";
    if(related.length > 0 ){
        content = `
        <div class="row">
            <h2>Personajes relacionados</h2>
            <hr>
        </div>`;
        content += displayData(related, false);
    }
    document.getElementById("related").innerHTML = content;
}

function history(){
    //Muestra el historial de busqueda en el offcanvas
    const bsOffcanvas = new bootstrap.Offcanvas('#historyOffcanvas');
    bsOffcanvas.show();

    let historial = getUserData();
    let content = `<ol class="list-group list-group-numbered">`;

    if(historial.length == 0){
        content = "No hay busquedas recientes."
    }else{
        historial.forEach(record => {
            content += `<li class="list-group-item">${record}</li>`;
        });
        content += `</ol>`;
    }
    document.getElementById("offcanvas-body").innerHTML = content;
}

function detail(id){
    console.log("detail:"+id);
    
    let personaje = personajes.find(personaje => personaje.id == id);
    
    console.log(personaje);
    let content = `
    <div class="row mx-4">
    <div class="col-4">
        <img class="detailImg" src="${personaje.image}">
    </div>
    <div class="col ms-2">
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><p>Raza:</p><p>${personaje.race}</p></li>
            <li class="list-group-item"><p>Grupo:</p><p>${personaje.affiliation}</p></li>
            <li class="list-group-item"><p>Gender:</p><p>${personaje.gender}</p></li>
            <li class="list-group-item"><p>ki:</p><p>${personaje.ki}</p></li>
            <li class="list-group-item"><p>Max ki:</p><p>${personaje.maxKi}</p></li>
            <li class="list-group-item"><p>${personaje.description}</p></li>
            </ul>
    </div>
    </div>`;
    document.getElementById("bodyModal").innerHTML = content;
    document.getElementById("ModalLabel").innerHTML = personaje.name;
    //muestro modal
    var modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
}