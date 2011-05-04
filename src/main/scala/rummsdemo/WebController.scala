package rummsdemo

import scutil.log.Logging
import scjson._
import rumms._

final class WebController(context: ControllerContext) extends Controller with Logging {
	/** used for client-side version checking */
	val version = 1
	/** available as rumms.userData in the client */
	val userData:JSValue = JSSerialization serialize None
	
	var clients = Set[ConversationId]() 
	
	/** the browser sent a message to us */
	def receiveMessage(conversationId:ConversationId, messageJS:JSValue):Unit = {
		val message = (JSSerialization deserialize messageJS).asInstanceOf[Message]
		DEBUG("receive:", message)
		message match {
			case request: ChatRequest		=> handleChatRequest(conversationId, request)
			case x							=> ERROR("unexpected message", x)
		}
	}
	
	def handleChatRequest(conversationId:ConversationId, request:ChatRequest): Unit = {
		sendMessage(conversationId, ChatResponse(request.message))
	}
	
	def sendMessage(conversationId:ConversationId, message:Message): Unit = {
		val messageJS = JSSerialization serialize message
		clients foreach { id => context.sendMessage(id, messageJS) }
	}
	
	/**  a new Conversation has been opened */
	def conversationAdded(conversationId:ConversationId):Unit = {
		clients = clients + conversationId		
	}
	
	/** an existing Conversation has been closed */
	def conversationRemoved(conversationId:ConversationId):Unit = {
		clients = clients - conversationId			
	}
	
	/** the application is going down */
	def dispose():Unit = DEBUG("Shutdown application")

	/** the browser uploads some data. returns false if the upload was rejected */
	def handleUpload(conversationId:ConversationId, message:JSValue, upload:Upload):Boolean = true 
	
	/** the browser wants to download some data. returns None if the download was rejected. */
	def handleDownload(conversationId:ConversationId, message:JSValue):Option[Download] = None
	
	/** called after a single upload request is finished, possibly after multiple calls to handleUpload */
	def uploadBatchCompleted(conversationId:ConversationId):Unit = true

}
