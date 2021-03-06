package .restapi;

import java.io.DataOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

 

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * /restapi/restart/group/{groupid}
 * /restapi/restart/player/{playerid}
 * /restapi/poweroff/group/{groupid}
 * /restapi/poweroff/player/{playerid}
 * /restapi/wol/group/{groupid}
 * /restapi/wol/player/{playerid}
 * 
 * 
 * Edge server: It work on group & player call
 * restart
 * objs:[{"id":2,"type":2}]
 * type:1
 * 
 * http://host/modules/group/Servlet/ajax/updateWakeOnLan.action;jsessionid=C74A1D729C023A67BE96D89082542EA9?random=0.6765007097485773
 * Response format
 * {
 *   "ok": false,
 *   "message": "authorization error. ",
 *   "data": null
 * }

 * @author Alex
 *
 */
@Controller
public class RESTPController2 {
	private static Logger aLogger = Logger.getLogger(RESTGroupActController.class);
	
	@Autowired
	GroupService groupService;
	@Autowired
	AccountService accService;
	@Autowired
	MediaService mediaService;	
	@Autowired
	PlaylistService playlistService;
	@Autowired
	PlayerService playerService; 
	
	@Autowired
	PlayerExtService playerServiceExt;
	@Autowired
	PlayerScreenService screenService;
	@Autowired
	EdgeServerService edService;
	//begin-->>
	@Autowired
	PrivilegeService privilegeService;
	@Autowired
	CommandService commandService;
	//<<--end
	/** 1000:group, 1001:folder, 2:ES, 1:player */ 
	private int TYPE_FOLDER = 1001;
	/** 1000:group, 1001:folder, 2:ES, 1:player */ 
	private int TYPE_GROUP = 1000;
	
	private int TYPE_PLAYER = 1;
	
	private int TYPE_EDGE_SERVER = 2;
	
	private int GROUP_TYPE_POWEROFF = 1000;
	
	/**
	 * Wake on lan
	 */
	private int GROUP_TYPE_WOL = 1000;
	
	private int GROUP_ACTION_TYPE = 1;
	
	private int GROUP_ACTION_TYPE_POWEROFF = 2;
	
	/**
	 * Wake on lan
	 */
	private int GROUP_ACTION_TYPE_WOL = 0;
	
	private int PLAYER_TYPE_WOL = 1;
	
	private int PLAYER_TYPE_POWEROFF = 1;
	
	private int PLAYER_TYPE_RESTART = 1;
	
	private int PLAYER_ACTION_TYPE_WOL = 2;
	
	private int PLAYER_ACTION_TYPE_POWEROFF = 2;
	
	private int PLAYER_ACTION_TYPE_RESTART = 1;
	/**
	 * http://localhost/modules/group/Servlet/ajax/updateRestart.action;jsessionid=2318706275C1004F57EEC89A073EBC0E?random=0.44352719333363155
	 * objs:[{"id":3,"type":1001}]
	 * type:1
	 * 
	 * Response format
	 * {
	 *   "ok": false,
	 *   "message": "authorization error. ",
	 *   "data": null
	 * }
	 * 
	 * @TODO ALEX = Cheeck the behavior of no group message. Is it ok:true still?
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/restart/group/*")
	public void  restartGroup( HttpServletRequest request, HttpServletResponse response) throws Exception{ //fixed bug 0044259  add by cuige
        String respStr = "";
        String actionRtn = "";
		try{
			
			//Parse the request parameters and save some attributes for the connect.
			parseRequestParam(request,GROUP_ACTION_TYPE ,"/group/*");
			
			//Connect to original action
			actionRtn = connect(request, response,"/modules/group/Servlet/ajax/updateRestart.action");
			
			//Parse the target action return json string and generate the REST fromat json string.
			respStr = parseActionReturn(actionRtn);
			
			//get the response and parse the json string
			//then generate the new response json string
			response.getWriter().write(respStr);
			
		}catch(Exception e){
			
		}finally{
			
		}
	}
	
	
	/**
	 * http://host/modules/group/Servlet/ajax/updateRestart.action;jsessionid=FCA939D902069BA8BC317553A16AC60A?random=0.1819806149462886
	 * objs:[{"id":5,"type":1000}]
	 * type:2
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/poweroff/group/*")
	public void  poweroffGroup( HttpServletRequest request, HttpServletResponse response) throws Exception{ //fixed bug 0044259  add by cuige
        String respStr = "";
        String actionRtn = "";
		try{
			//Parse the request parameters and save some attributes for the connect.
			parseRequestParam(request,GROUP_ACTION_TYPE_POWEROFF,"/group/*");
			
			//Connect to original action
			actionRtn = connect(request, response,"/modules/group/Servlet/ajax/updateRestart.action");
			
			//Parse the target action return json string and generate the REST fromat json string.
			respStr = parseActionReturn(actionRtn);
			
			//get the response and parse the json string
			//then generate the new response json string
			response.getWriter().write(respStr);
			
		}catch(Exception e){
			
		}finally{
			
		}
	}
	
	/**
	 * objs:[{"id":1,"type":1}]
	 * type:2
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/poweroff/player/*")
	public void  poweroffPlayer( HttpServletRequest request, HttpServletResponse response) throws Exception{ //fixed bug 0044259  add by cuige
        String respStr = "";
        String actionRtn = "";
		try{
			//Parse the request parameters and save some attributes for the connect.
			parseRequestParam(request,PLAYER_ACTION_TYPE_POWEROFF, "/player/*");
			
			//Connect to original action
			actionRtn = connect(request, response,"/modules/group/Servlet/ajax/updateRestart.action");
			
			//Parse the target action return json string and generate the REST fromat json string.
			respStr = parseActionReturn(actionRtn);
			
			//get the response and parse the json string
			//then generate the new response json string
			response.getWriter().write(respStr);
			
		}catch(Exception e){
			
		}finally{
			
		}
	}
	
	/**
	 * http://host/modules/group/Servlet/ajax/updateWakeOnLan.action;jsessionid=FCA939D902069BA8BC317553A16AC60A?random=0.2507024453651676
	 * objs:[{"id":5,"type":1000}]
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/wol/group/*")
	public void wakeOnLanGroup( HttpServletRequest request, HttpServletResponse response) throws Exception{ //fixed bug 0044259  add by cuige
        String respStr = "";
        String actionRtn = "";
		try{
			//Parse the request parameters and save some attributes for the connect.
			parseRequestParam(request,GROUP_ACTION_TYPE_WOL, "/group/*");
			
			//Connect to original action
			actionRtn = connect(request, response,"/modules/group/Servlet/ajax/updateWakeOnLan.action");
			
			//Parse the target action return json string and generate the REST fromat json string.
			respStr = parseActionReturn(actionRtn);
			
			//get the response and parse the json string
			//then generate the new response json string
			response.getWriter().write(respStr);
			
		}catch(Exception e){
			
		}finally{
			
		}
	}
	
	/**
	 * objs:[{"id":1,"type":1}]
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/wol/player/*")
	public void wakeOnLanPlayer( HttpServletRequest request, HttpServletResponse response) throws Exception{ //fixed bug 0044259  add by cuige
        String respStr = "";
        String actionRtn = "";
		try{
			//Parse the request parameters and save some attributes for the connect.
			parseRequestParam(request,PLAYER_ACTION_TYPE_WOL,"/player/*");
			
			//Connect to original action
			actionRtn = connect(request, response,"/modules/group/Servlet/ajax/updateWakeOnLan.action");
			
			//Parse the target action return json string and generate the REST fromat json string.
			respStr = parseActionReturn(actionRtn);
			
			//get the response and parse the json string
			//then generate the new response json string
			response.getWriter().write(respStr);
			
		}catch(Exception e){
			
		}finally{
			
		}
	}
	
	/**
	 * http://host/modules/group/Servlet/ajax/updateRestart.action;jsessionid=068BCD6A4EA3C2ACC95C05FF2A1A584A?random=0.8555655120850956
	 * objs:[{"id":1,"type":1}]
	 * type:1
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/restart/player/*")
	public void  restartPlayer( HttpServletRequest request, HttpServletResponse response) throws Exception{ //fixed bug 0044259  add by cuige
        String respStr = "";
        String actionRtn = "";
		try{
			//Parse the request parameters and save some attributes for the connect.
			parseRequestParam(request,PLAYER_ACTION_TYPE_RESTART,"/player/*");
			
			//Connect to original action
			actionRtn = connect(request, response,"/modules/group/Servlet/ajax/updateRestart.action");
			
			//Parse the target action return json string and generate the REST fromat json string.
			respStr = parseActionReturn(actionRtn);
			
			//get the response and parse the json string
			//then generate the new response json string
			response.getWriter().write(respStr);
			
		}catch(Exception e){
			//@TODO ALEX - Collect the error message.
		}finally{
			
		}
	}
	
	/**
	 * Parse the response action string and generate the REST format json string.
	 * 
	 * @param actionRtn Get the response string from the target action
	 * @return
	 */
	private String parseActionReturn(String actionRtn){
		JSONObject jsonObj = JSONObject.fromObject(actionRtn);
		JSONObject jsonRtnObj = new JSONObject();
		
		Object okValue = jsonObj.get("ok");
		if(okValue!=null && okValue.toString().trim().equalsIgnoreCase("true")){
			jsonRtnObj.accumulate("ok", true);
			jsonRtnObj.accumulate("message", "");
			jsonRtnObj.accumulate("data", "");
		}else{//@TODO ALEX - collect the return error message and format. 
			jsonRtnObj.accumulate("ok", false);
			jsonRtnObj.accumulate("message", "");
			jsonRtnObj.accumulate("data", "");
		}
		return jsonRtnObj.toString();
	}
	
	/**
	 * Parse the request parameters and save the 'objs' to request.
	 * 
	 * @param request
	 * @param actionType
	 * @param targetType
	 */
	private void parseRequestParam(HttpServletRequest request, int actionType, String urlPattern){
		//final String pattern = "/group/*";
        final String[] names = {"id"};
        Map<String, String> pathMap = PathUtil.getPathVariables(urlPattern, names, request.getPathInfo());
        String id = pathMap.get("id");
        System.out.println("group id="+id);
        
        int targetType = getTargetGroupTypeById(id);
        //Get the target type
        if(urlPattern!=null && urlPattern.contains("player")){
        	targetType = getTargetPlayerTypeById(id);
        }else{
        	targetType = getTargetGroupTypeById(id);
        }
		
        
		//request.setAttribute("type", GROUP_ACTION_TYPE);
        request.setAttribute("type", actionType);
		StringBuilder sbObj = new StringBuilder("");
		sbObj.append("[{");
		sbObj.append("\"id\":").append(id);
		sbObj.append(",");
		//sbObj.append("\"type\":").append(GROUP_TYPE);
		sbObj.append("\"type\":").append(targetType);
		sbObj.append("}]");
		request.setAttribute("objs", sbObj.toString());
	}
	
	/**
	 * Suppose it's a group or folder, because it calls the group api.
	 * 1000:group, 1001:folder
	 * @param targetId
	 * @return
	 */
	private int getTargetGroupTypeById(String targetId){
		int targetType = 0;
		if(groupService!=null && targetId!=null && targetId.trim().length()>0){
			Group groupObj=groupService.getGroup(Integer.valueOf(targetId));
			if(groupObj!=null){
				if(groupObj.getIsfolder()==true){
					targetType = TYPE_FOLDER;
				}else{
					targetType = TYPE_GROUP;
				}
			}else{
				//This section is for the edge server, it's compatible to 2 button area and works both.
				//If getting the group none, checking the player and its type is TYPE_EDGE_SERVER, run it still.
				Player player = playerService.getPlayerByPrimaryKey(Integer.valueOf(targetId));
				if(player!=null && player.getPlayertype()==TYPE_EDGE_SERVER){
					targetType = TYPE_EDGE_SERVER;
				}
			}
		}
		return targetType;
	}
	
	private int getTargetPlayerTypeById(String targetId){
		int targetType = 0;
		if(playerService!=null && targetId!=null && targetId.trim().length()>0){
			Player playerObj=playerService.getPlayerByPrimaryKey(Integer.valueOf(targetId));
			if(playerObj!=null){
				if(playerObj.getPlayertype()==TYPE_PLAYER){
					targetType = TYPE_PLAYER;
				}else{
					targetType = TYPE_EDGE_SERVER;
				}
			}
		}
		return targetType;
	}
	
	private String connect(HttpServletRequest request, HttpServletResponse response, String actionStr){
		StringBuilder sbUrl = new StringBuilder("");
		sbUrl.append(request.getScheme());
		sbUrl.append("://");
		sbUrl.append(request.getServerName());
		sbUrl.append(":");
		sbUrl.append(request.getServerPort());
		//sbUrl.append("/modules/group/Servlet/ajax/updateRestart.action");
		sbUrl.append(actionStr);
		
		sbUrl.append(";jsessionid=");
		
		sbUrl.append(request.getSession().getId());
		
		System.out.println("url="+sbUrl.toString());
		String theString = connect(sbUrl.toString(),"POST",response, request); 
		
		System.out.println(theString);
		return theString;
	}
	
	private String composeUrlParam(HttpServletRequest request){
		StringBuilder sbUrlParam = new StringBuilder("");
		sbUrlParam.append("objs=");
		sbUrlParam.append(request.getAttribute("objs"));
		sbUrlParam.append("&type=").append(request.getAttribute("type"));
		
		System.out.println(sbUrlParam.toString());
		
		return sbUrlParam.toString();
	}
	
	private String connect(String targetUrlStr, String requestMethod, HttpServletResponse response, HttpServletRequest request){
		HttpURLConnection httpConn = null;
		int responseCode = 0;
		String encoding = "";
		InputStream inputStr = null;
		String theString = "";
		try {
			httpConn = configUrlConnection(targetUrlStr, requestMethod, composeUrlParam(request));
			responseCode = httpConn.getResponseCode();
	    	encoding = httpConn.getContentEncoding() == null ? "UTF-8": httpConn.getContentEncoding();
	    	
	    	response = setResponseHeader(response, httpConn.getHeaderFields());
	    	
	    	if (responseCode == 200) {
	    		inputStr = httpConn.getInputStream();
            }else{
            	inputStr = httpConn.getErrorStream();
            }
	    	
	    	//NOTE:does not close inputStream, you can use IOUtils.closeQuietly for that
	    	theString = IOUtils.toString(inputStr, encoding); 
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			//close the input stream
		}
		return theString;
	}
	
	private HttpServletResponse setResponseHeader(HttpServletResponse response, Map<String, List<String>> headerFields) {
		if(headerFields!=null){
			List<String> valueList;
			String key;
			for (Map.Entry<String, List<String>> entry : headerFields.entrySet()) {
				key = entry.getKey();
				
				valueList = entry.getValue();
				
				if( !("Access-Control-Allow-Headers").equalsIgnoreCase(key) &&
						!("Access-Control-Allow-Methods").equalsIgnoreCase(key) &&
						!("Access-Control-Allow-Origin").equalsIgnoreCase(key) &&
						!("Transfer-Encoding").equalsIgnoreCase(key)){
					for(String headVal:valueList){
						response.setHeader(key, headVal);
					}
				}
			}
		}
		
		return response;
	}
	
	private HttpURLConnection configUrlConnection(String targetUrlStr, String requestMethod, String urlParameters) throws Exception {
		HttpURLConnection httpConn = null;
		URL httpsURL;
		//String urlParameters ="";
		byte[] postData;
		try {
			
			//urlParameters  = "type=1&objs=[{\"id\":3,\"type\":1001}]";
			//urlParameters  = "";
			postData = urlParameters.getBytes( StandardCharsets.UTF_8 );
			int postDataLength = postData.length;
			
			if(targetUrlStr!=null)	targetUrlStr = targetUrlStr.trim();
			httpsURL = new URL(targetUrlStr);
			//Do some security checking skip when HTTPS
	        String[] strProtocal = targetUrlStr.split(":");
	        if(strProtocal != null && strProtocal.length>0){
	            if("HTTPS".equalsIgnoreCase(strProtocal[0])){
					//boolean trustAnyCertificate = CMConfiguration.getInstanceOf().getTrustAnyCertificate();
		            if(CMConfiguration.getInstanceOf().getTrustAnyCertificate()){
		                SSLContext context = SSLContext.getInstance("SSL");
		                context.init(null, new TrustManager[]{new TrustAnyTrustManager()}, new SecureRandom());
		                
		                httpConn = (HttpsURLConnection) httpsURL.openConnection();
		                ((HttpsURLConnection) httpConn).setSSLSocketFactory(context.getSocketFactory());
		                ((HttpsURLConnection) httpConn).setHostnameVerifier(new TrustAnyHostnameVerifier());		                		               
		            }
	        	}else{
	        		httpConn = (HttpURLConnection) httpsURL.openConnection();
	        	}	
	        }else{
	        	httpConn = (HttpURLConnection) httpsURL.openConnection();
	        }
	        
	        //Set the connection timeout to 10 seconds and the read timeout to 10 seconds
	        httpConn.setConnectTimeout(10000);
	        httpConn.setReadTimeout(10000);
	        
			//Set GET/POST or other method
	        httpConn.setRequestMethod( requestMethod!=null?requestMethod.toUpperCase():"" );
	        httpConn.setDoOutput(true);
	        httpConn.setDoInput(true);
	        httpConn.setUseCaches(false);
	        
	        //Do post parameter for the http connection
	        if(requestMethod!=null && "POST".equalsIgnoreCase(requestMethod)){
	        	httpConn.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded"); 
	        	httpConn.setRequestProperty( "Content-Length", Integer.toString( postDataLength ));
	        	DataOutputStream wr = new DataOutputStream( httpConn.getOutputStream());
	        	wr.write( postData );	
	        }
		} catch (MalformedURLException e) {
			e.printStackTrace();
			throw e;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			throw e;
		} catch (Exception e){
			e.printStackTrace();
			throw e;
		}
		
        return httpConn;
	}

}
