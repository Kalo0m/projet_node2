var page = 1;
var count = 20;
function rechargement(){
	setTimeout(() => { 
		console.log('rafraichissement');
		var lignes = $('tbody tr');
		console.log(lignes);
		$.each(lignes,(index,value)=>{
			value.style.cursor='pointer';
			var nomSansEspaces = value.cells[1].innerText.replace(' ','_');
			value.addEventListener('click',function(){
				if(!$('.'+nomSansEspaces).length){
					console.log('création de room');
					socket.emit('createRoom', value.cells[1].innerText); //on rejoint la room portant le nom de la bière
					
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
					socket.on('initialisation',data=>{
						console.log('initialisation');
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
					var textareas = $('.chat-text .textarea-chat');
					console.log(textareas.last());
					textareas.last().keypress(function(event) {
						
						if(event.keyCode == 13){
							var $this =$(this);
							console.log($this);
							$('.'+nomSansEspaces).last().append("<div class='msg-send'><p class='message'>"+$this.val()+"</p></div>")
							socket.emit('sendMessage',[value.cells[1].innerText,$this.val()]);
	
							$this.val('');
	
						}
					})
				}
				
			});
			

		});
		
	}, 200);
}
function remplirTableau(data){
    const ulBiere = document.getElementById('tabBiere');
    ulBiere.innerHTML='';
    data.map((item,id)=>{
        ulBiere.innerHTML+="<tr><th scope=row>"+(id+1+(page-1)*count)+"</th><td>"+item.name+"</td><td>"+item.alcohol_by_volume+"</td><td>"+item.category+"</td><td>"+item.country+"</td></tr>";
    })
}
function appelFech(url){
    fetch(url)
    .then(response => response.json())
    .then(data => {
		remplirTableau(data);
		rechargement();
    })
    .catch(error => console.log(error));
}
appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count);
const previous = document.getElementById('previous');
const next = document.getElementById('next');
previous.addEventListener('click',()=>{
    page--;
    if(page == 1){
        previous.classList.add("disabled");
    }
    appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count);

});
next.addEventListener('click',()=>{
    page++;
    previous.classList.remove("disabled");
    appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count);
});


const buttonSearch = document.getElementById('button');
const name = document.getElementById('name_beer');
const categorie =  document.getElementById('categorie_beer');
const country =  document.getElementById('country_beer');
buttonSearch.addEventListener('click',()=>{
    console.log(name.value)
    appelFech("http://localhost:3000/api/beer?page="+page+"&count="+count+"&country="+country.value+"&categorie="+categorie.value+"&name="+name.value)
});





var socket = io.connect('http://localhost:3000');
socket.on('init',data =>{
	data.map(item=>{
		$('#forum-message').append("<div class='msg-send'><p class='message'>"+item[0]+"</p></div>");
		$('#forum-message').append("<div class='msg-receive'>description : "+item[1]+"</div>");
	})
})
socket.on('broad',data=>{ // data = [client,serveur]
	
	$('#forum-message').append("<div class='msg-send'>"+data[0]+"</div>");
	$('#forum-message').append("<div class='msg-receive'>"+data[1]+"</div>");
})
socket.on('messageBroad',data=>{
	console.log('message recu du serveur')
	console.log(data);
	var msgSansEspace = data[0].replace(' ','_');
	console.log(msgSansEspace);
	$('.'+msgSansEspace).append("<div class='msg-receive'>"+data[1]+"</div>");
})
$(function(){
	var arrow = $('.chat-head img');
	var textareaForum = $('#textareaForum');

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

	textareaForum.keypress(function(event) {
		var $this = $(this);
		console.log($this);
		if(event.keyCode == 13){

			var msg = $this.val();
			var description ="";
			msgsplit = msg.split(' ');
			msgenc = msgsplit.join('%20');
			console.log(msgenc);
			fetch("http://localhost:3000/api/beer?name="+msgenc).then(data=>data.json()).then(data=>{
				console.log(data);
				if((data.length == 1 && msgenc == data[0].name) || data.map(item=>item.name).includes(msg)){
					if(data.length == 1){
						description = data[0].description;
					}else{ // on a plusieur ligne dans le tableau mais il y a une ligne qui contient exactement l'input
						description = data[data.map(item=>item.name).indexOf(msg)].description;
					}
					if(description == ''){
						socket.emit('envoieDescription',[msg,"Il n'y a pas de description pour cette bière &#128533"]);
						$this.val('');
						$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>");
						$('#forum-message').append("<div class='msg-receive'> Il n'y a pas de description pour cette bière &#128533</div>");
					}else{
						socket.emit('envoieDescription',[msg,description]);
						$this.val('');
						$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>");
						$('#forum-message').append("<div class='msg-receive'>description : "+description+"</div>");
					}
						
				}else{
					console.log('bière non trouvé')
					var noms = data.map(item=>item.name);
					console.log('descriptions proposés : ');
					console.log(noms);

					var str = 'Bière non trouvé, vouliez-vous dire : <br>';
					noms.map(item=>str=str+item+'<br>');
					$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>");
					$('#forum-message').append("<div class='msg-receive'>description : "+str+"</div>");
					$this.val('');
				}
				
			}).catch(err=>{
				console.log('erreur : '+err);
				$this.val('');
				
				$('#forum-message').append("<div class='msg-send'><p class='message'>"+msg+"</p></div>");
				$('#forum-message').append("<div class='msg-receive'>Désolé, nous ne connaissons pas cette bière &#128533 </div>");
			});
			
		}
	})
	rechargement();
	
	
	


}); 