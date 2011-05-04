import sbt._

final class RummsDemoProject(info:ProjectInfo) extends DefaultWebProject(info) {
	// the next 5 libraries have to be build locally, check README for more information.
	val scutil				= "de.djini"				%% "scutil"					% "0.0.2"			% "compile"
	val scjson				= "de.djini"				%% "scjson"					% "0.0.2"			% "compile"
	val rumms				= "de.djini"				%% "rumms-framework"		% "0.0.2"			% "compile"
	
	val servlet_api			= "javax.servlet"			% "servlet-api"				% "2.5"				% "provided"
	val jetty7_server		= "org.eclipse.jetty"		% "jetty-server"			% "7.3.0.v20110203" % "test"
	val jetty7_webapp		= "org.eclipse.jetty"		% "jetty-webapp"			% "7.3.0.v20110203" % "test"
	val jetty7_servlets		= "org.eclipse.jetty"		% "jetty-servlets"			% "7.3.0.v20110203" % "test"
	
	// override def compileOptions	= super.compileOptions ++ Seq(Unchecked)
}
