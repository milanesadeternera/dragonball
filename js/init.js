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



function getUserData(){
    let data = JSON.parse(localStorage.getItem("dragonball"));
    if(data === null){
        return [];
    }else{
        return data;
    }

}

function setUserData(data){
    localStorage.setItem("dragonball", JSON.stringify(data));
    return true;
}