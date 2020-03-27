var page = 0; // numero de page au départ 
var count = 20; // nombre de bière par page
function rechargement(){
	$(function(){
		var arrow = $('.chat-head img');
		var textareaForum = $('#textareaForum');
	
		arrow.on('click', function(){ // quand on clique sur un petite fleche du chat 
			var src = arrow.attr('src');
	
			$('.chat-body').slideToggle('fast'); // on descend le chat
			if(src == 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png'){
				arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_up-16.png');
			}
			else{
				arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png');
			}
		});
	
		textareaForum.keypress(function(event) { // quand on tape une lettre dans le champ de text du forum
			var $this = $(this);
			if(event.keyCode == 13){ // si cest la touche entrée
				var msg = $this.val();
				var description ="";
				msgsplit = msg.split(' ');
				msgenc = msgsplit.join('%20'); // on convertit les espaces en %20 (il me semble que cest pas la peine mias cest toujours mieux)
				fetch("http://localhost:3000/api/beer?name="+msgenc).then(data=>data.json()).then(data=>{ //on récupère la bière ayant le nom entré
					if((data.length == 1 && msgenc == data[0].name) || data.map(item=>item.name).includes(msg)){ // si on a trouvé une ou plusieurs bière dont le nom contient l'entré
						if(data.length == 1){ // si il n'y a qu'une ière on prend le premier element du tableau
							description = data[0].description; // on prend sa description
						}else{ // on a plusieur ligne dans le tableau mais il y a une ligne qui contient exactement l'input
							description = data[data.map(item=>item.name).indexOf(msg)].description; // sinon on la cherche dans le tableau
						}
						if(description == ''){ // si il n'y pas de description on informe l'utilisateur
							socket.emit('envoieDescription',[msg,"Il n'y a pas de description pour cette bière &#128533"]); //envoie d'evenement
							$this.val('');
							$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>"); // on ajoute dans la chatbox
							$('#forum-message').append("<div class='msg-receive'> Il n'y a pas de description pour cette bière &#128533</div>");
						}else{
							socket.emit('envoieDescription',[msg,description]); // si il y a une description
							$this.val('');
							$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>"); // on ajoute dans la chatbox
							$('#forum-message').append("<div class='msg-receive'>description : "+description+"</div>");
						}
							
					}else{ // pas trouvé de bière
						var noms = data.map(item=>item.name); // on récupère tous les nom 
						var str = 'Bière non trouvé, vouliez-vous dire : <br>';
						noms.map(item=>str=str+item+'<br>'); // formation de la string a renvoyé
						$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>"); //ajout dans la chatbox
						$('#forum-message').append("<div class='msg-receive'>description : "+str+"</div>");
						$this.val(''); // on remet le champ de texte à vide
					}
					
				}).catch(err=>{ // aucune bière ne correspond à l'entrée
					$this.val('');
					$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>"); // on informe l'utilisateur
					$('#forum-message').append("<div class='msg-receive'>Désolé, nous ne connaissons pas cette bière &#128533 </div>");
				});
				
			}
		})
		setTimeout(() => {  // on attend la fin du fetch
			var lignes = $('tbody tr'); // on récupère toutes les lignes
			$.each(lignes,(index,value)=>{ //pour chaques lignes 
				value.style.cursor='pointer'; // on ajoute la propriete css cursor : pointer
				var nomSansEspaces = value.cells[1].innerText.replace(' ','_'); // on transforme le nom de la bière pour enelver les espaces
				value.addEventListener('click',function(){ // quand on clique sur la bière
					if(!$('.'+nomSansEspaces).length){ //si il n'y a pas deja une chatox pour cette bière
						socket.emit('createRoom', value.cells[1].innerText); //on rejoint la room portant le nom de la bière
						// on ajoute une chat box (on ne peut pas en créer plus que 4 => trop long de gérer ce problème sachant que le client n'est pas évalué)
						$('.chat-box-container').append(`
						<div class="chat-box">
						<div class="chat-head">
						  <h2 class='titre2'>`+ value.cells[1].innerText+`</h2> 
						  <img src="https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png" title="Expand Arrow" width="16">
						</div>
						<div class="chat-body">
						  <div class="msg-insert `+nomSansEspaces+`">
							
						  </div>
						</div>
				
						  <div class="chat-text">
							<textarea class='textarea-chat' placeholder="Send"></textarea>
						  </div>
						  
						  </div>
						`);
						socket.on('initialisation',data=>{ // on ajoute les messages si il y en avait déjà sur le serveur
							data.map(item=>$('.'+nomSansEspaces).append("<div class='msg-receive'><p class='message'>"+item+"</p></div>"))
						});
						var arrow = $('.chat-head img');
			
		
						arrow.on('click', function(){
							var src = arrow.attr('src');
		
							$('.chat-body').slideToggle('fast');
							if(src == 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png'){
								arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_up-16.png');
							}
							else{
								arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png');
							}
						});
						var textareas = $('.chat-text .textarea-chat'); // on récupère la texte area
						textareas.last().keypress(function(event) {
							
							if(event.keyCode == 13){ // si on appuie sur la touche entré dans la textarea
								var $this =$(this);
								console.log($this);
								$('.'+nomSansEspaces).last().append("<div class='msg-send'><p class='message'>"+$this.val()+"</p></div>") // ajoute un message
								socket.emit('sendMessage',[value.cells[1].innerText,$this.val()]); //on informe le serveur
		
								$this.val(''); //on met le champ de texte à vide
		
							}
						})
					}
					
				});
				
	
			});
			
		}, 200);
		
		
		
	
	
	}); 
	
}
function remplirTableau(data){ //data = tableau de bières
    const ulBiere = document.getElementById('tabBiere');
    ulBiere.innerHTML='';
    data.map((item,id)=>{
        ulBiere.innerHTML+="<tr><th scope=row>"+(id+1+(page)*count)+"</th><td>"+item.name+"</td><td>"+item.alcohol_by_volume+"</td><td>"+item.category+"</td><td>"+item.country+"</td></tr>";
    })
}
function appelFech(url){
    fetch(url)
    .then(response => response.json())
    .then(data => {
		remplirTableau(data);
		rechargement(); // rechargement de la page
    })
    .catch(error => console.log(error));
}
appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count); // au depart on ajoute les bières avec page = 0
const previous = document.getElementById('previous');
const next = document.getElementById('next');
previous.addEventListener('click',()=>{ // lorsqu'un clique sur le boutton pour revenir à la page d'avant
    page--;
    if(page == 0){ // si la page vaut 0 on rend le boutton pour revenir à la page précedente disable
        previous.classList.add("disabled");
	}
    appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count);

});
next.addEventListener('click',()=>{ // pareil pour page suivante
    page++; // on a pas gérer le fait qu'on ne puisse plus cliquer sur le boutton next quand il n'y avait plus de donné à afficher
	previous.classList.remove("disabled");
    appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count);
});


const buttonSearch = document.getElementById('button');
const name = document.getElementById('name_beer');
const categorie =  document.getElementById('categorie_beer');
const country =  document.getElementById('country_beer');
buttonSearch.addEventListener('click',()=>{ //bar de recherche
    appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count+"&country="+country.value+"&categorie="+categorie.value+"&name="+name.value)

});





var socket = io.connect('http://localhost:3000'); // connexion au serveur
socket.on('init',data =>{ //initialisation du forum
	data.map(item=>{
		$('#forum-message').append("<div class='msg-send'><p class='message'>"+item[0]+"</p></div>");
		$('#forum-message').append("<div class='msg-receive'>description : "+item[1]+"</div>");
	})
})
socket.on('broad',data=>{ // data = [client,serveur] récupération de message dans le forum
	
	$('#forum-message').append("<div class='msg-send'>"+data[0]+"</div>");
	$('#forum-message').append("<div class='msg-receive'>"+data[1]+"</div>");
})
socket.on('messageBroad',data=>{ // message recu d'un chat 'entreAMi'
	var msgSansEspace = data[0].replace(' ','_'); // transformation du nom de la bière
	$('.'+msgSansEspace).append("<div class='msg-receive'>"+data[1]+"</div>");
})
