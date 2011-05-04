$(function() {
	
	var conversationId_	= null;
	var conversation 	= null; 
	
	conversation = new rumms.Conversation({
							connected:		handleConnect,
							disconnected:	handleDisconnect,
							upgraded:		handleUpgrade,
							error:			handleError,
							message:		handleMessage//,
					});
	
	conversation.connect();

	function handleConnect(conversationId) {
		conversationId_ = conversationId;
		chatUI.addLine("Session established"); 
	}

	function handleDisconnect(conversationId) {
		console.debug("Session lost");
		conversationId_	= null;
	}

	function handleUpgrade(version) {
		console.debug("Server upgrade", version);
	}
	
	function handleError(error) {
		console.debug("Recieve error", error);
	}
	
	function handleMessage(message) {
		console.debug("Recieve message", message);
		chatUI.addLine(message.message); 
	}
	
	function send(message) {
		console.debug("send message", message); 
		conversation.send(message); 
	}
	
	function handleChatLineEntered(chatLine) {
		sendChatRequest(chatLine); 
	}
		
	function sendChatRequest(message) {
			conversation.send({		
				_type: 	"rummsdemo.ChatRequest", 
				message: message
			}); 
	} 	
	var chatUI = new ChatUI({
		chatLineEntered: handleChatLineEntered
	})
	
	$('body').after(chatUI.element)		
}); 