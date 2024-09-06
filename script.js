URL="https://dragonball-api.com/api/characters"
//URL="data.json"
let personajes = [];

document.addEventListener("DOMContentLoaded",async ()=>{
    document.getElementById("buscar").addEventListener("input", buscar);


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

function displayData(values, type){
    console.log(values);
    let contenedor=document.getElementById("contenedor");
    data="";
    //values.forEach(element => {
    for(let i=0;i<=10 ; i++){
        console.log("i vale:"+i)
        element = values[i];
        data +=`<div class="card col-md-3 mt-3">
                        <div class="card-body">
                            <div class="image-container img-thumbnail mb-1">
                                <img class="image" src=${element.image}></image>
                            </div>
                            <h4 class="card-title fw-bold">${element.name}</h4>
                            <p class="card-text descripcion">${element.description}</p>
                        </div>
                    </div>`
    }

    //});
    contenedor.innerHTML=data;
}

function buscar(){
    let patron = document.getElementById("buscar").value;

    //Busco nombre de personaje
    let match = personajes.filter(personaje => !personaje.name.toLocaleLowerCase().search(patron.toLocaleLowerCase()))

    //console.log(match)
    displayData(match, "filter");

}