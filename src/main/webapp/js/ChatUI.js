/*// type hint
var ChatUIContext = {
	chatLineEntered: function(chatLine)	
};
 */
function ChatUI(context) {
	this.context	= context; 
	
	this.fields		= ChatUI_DOM();
	this.element	= this.fields.$;
	
	this.fields.input.onkeypress	= this.handleInputKeyDown.bind(this);	
	this.fields.input.focus();
}

ChatUI.prototype = {
	addLine: function(text) {
		$(this.fields.output).after('<li>' + text + '</li>');
	}, 
	
	handleInputKeyDown: function(ev) {
		// if return was pressed
		if(ev.keyCode == 13) {
			this.context.chatLineEntered(this.fields.input.value); 
			this.fields.input.value = ""; 
		}
	}//,
}
