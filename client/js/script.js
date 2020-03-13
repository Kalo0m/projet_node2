var ulBiere = document.getElementById('tabBiere');
fetch("http://localhost:3000/api/beer")
.then(response => response.json())
.then(data => {
    data.map((item,id)=>{
        ulBiere.innerHTML+="<tr><th scope=row>"+(id+1)+"</th><td>"+item.name+"</td><td>"+item.alcohol_by_volume+"</td><td>"+item.category+"</td><td>"+item.country+"</td></tr>";
    })
})
.catch(error => alert("Erreur : " + error));




var txt = document.get('.form-control');
var btn = document.getElementById('.btn');
/*btn.addEventListener("click", function(){
    fetch("http://localhost:3000/api/beer?name="+txt)
    .then(response => response.json())
    .then(data => {
        data.map((item,id)=>{
            ulBiere.innerHTML+="<tr><th scope=row>"+(id+1)+"</th><td>"+item.name+"</td><td>"+item.alcohol_by_volume+"</td><td>"+item.category+"</td><td>"+item.country+"</td></tr>";
        })
    })
})
.catch(error => alert("Erreur : "+ error));
*/














































































































