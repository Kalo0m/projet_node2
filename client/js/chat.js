var socket = io.connect('http://localhost:3000');
socket.on('init',data =>{
	console.log('data init reçu');
})
socket.on('broad',data=>{ // data = [client,serveur]
	
	$('.msg-insert').append("<div class='msg-send'>"+data[0]+"</div>");
	$('.msg-insert').append("<div class='msg-receive'>"+data[1]+"</div>");
})
$(function(){
	var arrow = $('.chat-head img');
	var textarea = $('.chat-text textarea');

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

	textarea.keypress(function(event) {
		var $this = $(this);

		if(event.keyCode == 13){

			var msg = $this.val();
			var pays ="";
			msgsplit = msg.split(' ');
			msgenc = msgsplit.join('%20');
			console.log(msg)
			fetch("http://localhost:3000/api/beer?name="+msgenc).then(data=>data.json()).then(data=>{
				console.log("pays : "+data[0].country);
				pays = data[0].country;
				socket.emit('envoieDescription',[msg,pays]);
				$this.val('');
				console.log("pays : "+pays);
				
				$('.msg-insert').append("<div class='msg-send'>"+msg+"</div>");
				$('.msg-insert').append("<div class='msg-receive'>Pays : "+pays+"</div>");
			}).catch(err=>{
				console.log('erreur : '+err);
				socket.emit('envoieDescription',[msg,'bière non trouvé']);
				$this.val('');
				
				$('.msg-insert').append("<div class='msg-send'>"+msg+"</div>");
				$('.msg-insert').append("<div class='msg-receive'>bière non trouvé</div>");
			});
			
		}
	});

}); 