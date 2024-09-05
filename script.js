URL="https://dragonball-api.com/api/characters"
let personajes = [];

document.addEventListener("DOMContentLoaded",async ()=>{
    document.getElementById("buscar").addEventListener("click", buscar);

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

let getJSONData =  async function(url){
    let result = {};
    return await fetch(url)
    .then(response => {
      if (response.ok) {  
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

function displayData(values){
    let contenedor=document.getElementById("contenedor");
    data="";
    values.forEach(element => {
        data +=`<div class="card col-md-3">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <p class="card-text descripcion">${element.description}</p>
                        </div>
                    </div>`

    });
    contenedor.innerHTML=data;
}

function buscar(){
    let patron = document.getElementById("clave").value;
    let items = document.getElementsByClassName("personaje");
    for (let item of items) {
        if(item.innerHTML.match(patron)==null){
            item.style.display="none";
        }else{
            item.style.display="";
        }
    }    

}