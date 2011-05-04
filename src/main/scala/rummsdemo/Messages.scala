package rummsdemo

trait Message

case class ChatRequest(message:String) extends Message

case class ChatResponse(message:String) extends Message

