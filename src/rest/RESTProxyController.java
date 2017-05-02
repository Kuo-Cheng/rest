package restapi;




import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
//import org.codehaus.jackson.map.ObjectMapper;

import TrustAnyHostnameVerifier;
import TrustAnyTrustManager;

/** 
 * Provide the services to request the cross domain or general web to get the data. 
 * @TODO Alex Re-factor by the new parsing way:
 * 			1.Get the urlParam string
 *          2.Get the data object
 *          3. Parsing two to a dimensional array
 */
@Controller
public class RESTProxyController {
	
	private Logger restProxyLogger = Logger.getLogger(RESTProxyController.class);
	
//	private static String[] HTTP_BINARY_CONTENT_TYPE = {
//			"octet-stream","image","audio","video","x-icon","x-ico","drawing","vnd.android.package-archive","application/x-silverlight-app","vnd.iphone",
//			"msword","msaccess","vnd.visio","x-vsd","vnd.ms-excel","vnd.ms-powerpoint","x-mdb","x-msdownload","vnd.ms-project","x-ms-wma","x-ppt",
//			"gif","jpg","jpeg","png","x-mpeg","mpeg4","x-shockwave-flash",
//			"mid","pdf","vnd.adobe.pdx","vnd.rn-realaudio","x-pn-realaudio","vnd.rn-realmedia","vnd.adobe.rmf","x-pn-realaudio","vnd.rn-realmedia-vbr",
//			"vnd.rn-realsystem-rmx","vnd.rn-realplayer","vnd.rn-realvideo","streamingmedia","vnd.ms-pki.certstore","vnd.ms-pki.stl",
//			"x-bittorrent","x-top"
//	};
	
//	private static String[] HTTP_WCM_SUPPORTED_CONTENT_TYPE = {
//		"text/plain","text/xml","text/json","application/xml","application/json"	 
//	};
	
	/**
	 * This function receives the request, sends the 2nd request by the parameters, then return the response data.
	 * See and run the /restsample/index.html and main.js
	 * Test URL example https://com/ReportService/ConfigurationData.svc/Employees()?$filter=Disabled eq false&$orderby=FullName&$expand=EmployeeJobRates/Job";
	 * https://com/ReportService/ConfigurationData.svc/Employees()$expand=EmployeeJobRates$select=EmployeeJobRates/JobId,EmployeeId,FullName$top=5
	 *  var param = {};
	 *	param.url = 'https://com/ReportService/ConfigurationData.svc/Employees()';
	 *	param.type = 'GET';
	 *	param.data = [{'$filter':'Disabled+eq+false'},
	 *	              {'$orderby':'FullName'},
	 *	              {'$expand':'EmployeeJobRates/Job'}
	 *	              ];
	 *			  
	 *	param.headers=[{'Authorization':'AccessToken=wy39DVLSkXyG5ab2zrdCqtC65qLEqUeuk79EY7DgqTTUGPbFL63C9U2y',
	 *	               'ACCEPT':'application/json;odata=verbose'}];
	 *	
	 *	var proxyUrl = 'http://127.0.0.1:8080/restapi/proxy'+'[jsessionid]';
	 *	
	 *	proxyUrl = proxyUrl.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
	 *	
	 *	$.ajax({
	 *	    type: "POST",
	 *	    url: proxyUrl,
	 *	    dataType: "json",
	 *	    data: JSON.stringify(param),
	 *	 	contentType: 'application/json',
	 *	    success: function(msg){
	 *	    		format_resault(msg);
	 *              },
	 *        error:function(xhr, ajaxOptions, thrownError){ 
	 *                   alert(xhr.status); 
	 *                   alert(thrownError); 
	 *             }
	 *	});
	 */
	@RequestMapping(value="/proxy", method = RequestMethod.POST)
	//@RequestMapping(value="/proxy")
	public void proxyConnection(HttpServletRequest request,
								HttpServletResponse response) throws ServletException, IOException {
		restProxyLogger.info("RESTProxyController.proxyConnection on /proxy.");
		//String strRedirect = "";
		try {
			Map<String, String[]> paramsObj = request.getParameterMap();
//			strRedirect = getParamValue("redirect",paramsObj);
//			
//			if(strRedirect!=null && strRedirect.equalsIgnoreCase("false")){//redirect = false;
//				doProxyPage(request, response, paramsObj);
//				return;
			//}else{//redirect = true;
				doContentPage(request, response, paramsObj);
			//}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public String replaceSpaces(String str) {
	    String[] words = str.split(" ");
	    StringBuilder sentence = new StringBuilder("");

	    if(words!=null && words.length>0){
	    	
	    	sentence.append(words[0]);

	    for (int i = 1; i < words.length; ++i) {
	        sentence.append("%20");
	        sentence.append(words[i]);
	    }
	    }

	    return sentence.toString();
	}
	
	/** 
	 * Keep the original content and http status code. 
	 * @throws IOException 
	 */
	private void doContentPage(HttpServletRequest request, HttpServletResponse response, Map<String, String[]> paramsObj) throws IOException {
		
		String urlParamValue="";
		String[] paramArr;
		RESTHelper helper = new RESTHelper();
		int responseCode = 0;
		String targetUrlStr="";
	    String encoding = "";
		HttpURLConnection httpConn = null;
		InputStream inputStr = null;
		String envEncode = request.getCharacterEncoding();
		
		try {
			if(envEncode==null || envEncode.trim().length()==0)		envEncode="UTF-8";
			
			CommonUtils.printUserOperationLog("RESTProxyController.proxyConnection", request, response);
			
			urlParamValue = getParamValue("url",paramsObj);
			paramArr = getParamArr("data[]",paramsObj);
			targetUrlStr = parseUrlParams( urlParamValue, paramArr, envEncode);
			
			String requestMethod = getParamValue("type",paramsObj);
			String[] headerArr = getParamArr("headers[]",paramsObj);
			
			httpConn = configUrlConnection(targetUrlStr, requestMethod);
			
			if( headerArr!=null && headerArr.length>0){	
				String[] headerPair;
				for(int idx=0; idx<headerArr.length; idx++){
					if( headerArr[idx]!=null && headerArr[idx].length()>0 ){
						headerPair = headerArr[idx].split(":");
						if(headerPair!=null && headerPair.length>0){
							String headerKey = headerPair[0];
							String headerValue = "";
							if(headerPair.length>1){
								headerValue = headerPair[1];
							}
							httpConn.setRequestProperty(headerKey, headerValue);
						}
						
					}
				}//end for
			}
	    	
	    	responseCode = httpConn.getResponseCode();
	    	encoding = httpConn.getContentEncoding() == null ? "UTF-8": httpConn.getContentEncoding();
	    	
	    	response = setResponseHeader(response, httpConn.getHeaderFields());
	    	
	    	if (responseCode == 200) {
	    		inputStr = httpConn.getInputStream();
            }else{
            	inputStr = httpConn.getErrorStream();
            }

	    	response.setStatus(responseCode);
	    	respondStream(inputStr,response.getOutputStream());
    		return;	
	    }catch(UnknownHostException ue){		    	
	    	ue.printStackTrace();
	    	updateResponseObject(helper,httpConn,responseCode,encoding,ue.getMessage());
	    }catch(MalformedURLException e) {
			e.printStackTrace();
			updateResponseObject(helper,httpConn,responseCode,encoding,e.getMessage());	
	    }catch(IOException ie){		    		    	
	    	ie.printStackTrace();	  
	    	updateResponseObject(helper,httpConn,responseCode,encoding,ie.getMessage());	    	
		}catch(Exception e){
			e.printStackTrace();
			updateResponseObject(helper,httpConn,responseCode,encoding,e.getMessage());
		}
		return;	
	}
	
	private String parseUrlParams(String urlParamValue, String[] paramArr, String envEncode) {
		StringBuilder targetUrl = new StringBuilder("");
			//Get the url string
		if(urlParamValue!=null && urlParamValue.length()>0){
			targetUrl.append(urlParamValue.trim());
		}
			
			String[] targetUrlTmpArr = null;
			
			String targetUrlTmpStr = targetUrl.toString();
			String targetUrlDataStr = "";
			
			//Separate the url and the data string
		
			if(targetUrlTmpStr.contains("?")){
			//Exception Reason: 
			//	String p = "?"; // regex sees this as the "?" metacharacter 
			//	String p = "\?"; // the compiler sees this as an illegal Java escape sequence 
			//	String p = "\\?"; // the compiler is happy, and regex sees a question mark, not a metacharacter 
			targetUrlTmpArr = targetUrlTmpStr.split("\\?");
			if(targetUrlTmpArr!=null && targetUrlTmpArr.length>0){
				targetUrlTmpStr = targetUrlTmpArr[0];
				if(targetUrlTmpArr.length>1){
					StringBuilder sbTmp = new StringBuilder("");
					//More than one '?', loop and append them
					for(int idx=1; idx<targetUrlTmpArr.length; idx++){
						sbTmp.append(targetUrlTmpArr[idx]);
					}
					targetUrlDataStr = sbTmp.toString();
				}
			}
			}
			
			//Replace the spaces of the url
			if(targetUrlTmpStr.contains(" ")){
				targetUrlTmpStr = replaceSpaces(targetUrlTmpStr);
			}
			targetUrl = new StringBuilder(targetUrlTmpStr);
			
			//Append the data string back
			if(targetUrlDataStr!=null && targetUrlDataStr.trim().length()>0){
			//targetUrlDataStr = parseUrlDataString(targetUrlDataStr, envEncode);
			paramArr = parseUrlDataArray(paramArr, targetUrlDataStr, envEncode);
			//targetUrl.append("?").append(targetUrlDataStr);
			}
			
		//Parameters data string
		StringBuilder paramDataStr = new StringBuilder("");
		
			if(paramArr!=null && paramArr.length>0){
				//Adding the '?' if the parameters are not null and the url doesn't contain the '?'
				if(!targetUrl.toString().contains("?")){
				paramDataStr.append("?");
				}else{
				//The last char is question mark or '&', don't append the '&'
				if( !("?".equals(targetUrl.substring( targetUrl.length()-1, targetUrl.length() ) ) ) &&
					!("&".equals(targetUrl.substring( targetUrl.length()-1, targetUrl.length() ) ) ) ){
					paramDataStr.append("&");
				}
			}	
				
				String paramPair[];
			String pairOne="";
			String pairTwo="";
				for(int idx=0;idx<paramArr.length;idx++){
					if(paramArr[idx]!=null){
						if(!":".equals(paramArr[idx])){
							paramPair = paramArr[idx].split(":");
							if(paramPair!=null && paramPair[0]!=null && paramPair[0].trim().length()>0){
							try {
								pairOne = URLEncoder.encode( URLDecoder.decode(paramPair[0], envEncode) , envEncode);
							} catch (UnsupportedEncodingException e) {
								pairOne = paramPair[0];
								e.printStackTrace();
						}
							
							paramDataStr.append(pairOne).append("=");
						
							if(paramPair!=null && paramPair.length>1 && paramPair[1]!=null && paramPair[1].trim().length()>0){
								try {
									pairTwo = URLEncoder.encode( URLDecoder.decode(paramPair[1], envEncode) , envEncode);
								} catch (UnsupportedEncodingException e) {
									pairTwo = paramPair[1];
									e.printStackTrace();
					}
				}

							paramDataStr.append(pairTwo).append("&");
						}
					}
						
					}
			}
			}
	    	
		targetUrl.append(paramDataStr.toString());
	    	
		String rtnUrl = targetUrl.toString();
		if(("&".equals(rtnUrl.substring( rtnUrl.length()-1, rtnUrl.length() ) ) )){
			rtnUrl = rtnUrl.substring(0, rtnUrl.length()-1);
            }
	    	
		return rtnUrl;
	}

	/**
	 * Parse and merge the parameter string array.
	 * @param paramArr
	 * @param targetUrlDataStr
	 * @param envEncode 
	 * @return Parameter string array
	 */
	private String[] parseUrlDataArray(String[] paramArr, String targetUrlDataStr, String envEncode) {
		
		StringBuilder paramsBuf = new StringBuilder("");
		//String parsingRs = "";
		String[] newParamArr = null;
		List<String> paramList = new ArrayList<String>();
		
		try {
			
			//To keep the parameters sequence, put the urlDataString in front of the paramArr
			if(targetUrlDataStr!=null && targetUrlDataStr.length()>0){
				String[] paramsPair = targetUrlDataStr.split("&");
				
				if(paramsPair!=null && paramsPair.length>0){
					String[] keyValuePair;
					String key="", value="";
					for(int idx=0; idx<paramsPair.length; idx++){
						key="";
						value="";
						paramsBuf = new StringBuilder("");
						if(paramsPair[idx]!=null && paramsPair[idx].length()>0){
							keyValuePair = paramsPair[idx].split("=");
							if(keyValuePair[0]!=null && keyValuePair[0].length()>0){
								try{
								key = URLEncoder.encode(URLDecoder.decode(keyValuePair[0], envEncode), envEncode);
								}catch(Exception e){
									key = keyValuePair[0];
									e.printStackTrace();
								}
								
								if(keyValuePair.length>1){
									try{
								value = URLEncoder.encode(URLDecoder.decode(keyValuePair[1], envEncode), envEncode);
									}catch(Exception e){
										value = keyValuePair[1];
										e.printStackTrace();
									}
								}
								
								paramsBuf.append(key).append(":").append(value);
								paramList.add(paramsBuf.toString());
							}
						}
					}
				}
			}
			
			//Add the parameters to the parameters List
			if(paramArr!=null && paramArr.length>0){
				for(int idx=0; idx<paramArr.length; idx++){
					if(paramArr[idx]!=null && paramArr[idx].trim().length()>0){
						paramList.add(paramArr[idx]);
							}
						}
					}
			
			//Convert the List to String array
			if(paramList!=null && paramList.size()>0){
				newParamArr = new String[paramList.size()];
				for(int idx=0; idx<paramList.size(); idx++){
					newParamArr[idx] = paramList.get(idx);
				}
			}
		
		}catch(Exception e){
			newParamArr = paramArr;
			e.printStackTrace();
		}
		return newParamArr;
	}
	
	
//	private String parseUrlDataString(String[] paramArr, String targetUrlDataStr, String envEncode) {
//		StringBuilder paramsBuf = new StringBuilder("");
//		String parsingRs = "";
//		try {
//			if(targetUrlDataStr!=null && targetUrlDataStr.length()>0){
//				String[] paramsPair = targetUrlDataStr.split("&");
//				if(paramsPair!=null){
//					String[] keyValuePair;
//					String key, value;
//					for(int idx=0; idx<paramsPair.length; idx++){
//						if(paramsPair[idx]!=null && paramsPair[idx].length()>0){
//							keyValuePair = paramsPair[idx].split("=");
//							if(keyValuePair[0]!=null && keyValuePair[0].length()>0){
//								key = URLEncoder.encode(URLDecoder.decode(keyValuePair[0], envEncode), envEncode);
//								value = URLEncoder.encode(URLDecoder.decode(keyValuePair[1], envEncode), envEncode);
//								paramsBuf.append(key).append("=").append(value).append("&");
//							}
//						}
//					}
//				}
//			}
//			parsingRs = paramsBuf.toString();
//		} catch (UnsupportedEncodingException e) {
//			parsingRs = targetUrlDataStr;
//			e.printStackTrace();
//		}catch(Exception e){
//			parsingRs = targetUrlDataStr;
//			e.printStackTrace();
//		}
//		return parsingRs;
//	}

	/**
	 * Add the header and skip these headers
	 *			Access-Control-Allow-Headers:X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept
	 *			Access-Control-Allow-Methods:POST, GET, OPTIONS, PUT, DELETE, HEAD
	 *			Access-Control-Allow-Origin
	 *			Server
	 * @param response
	 * @param headerFields
	 * @return
	 */
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

	
	
	/**
	 * For the performance, using nio as the input / output 
	 */
	public static long respondStream(InputStream input, OutputStream output) throws IOException {
		long size = 0;
	    try{ 
	        ReadableByteChannel inputChannel = Channels.newChannel(input);
	        WritableByteChannel outputChannel = Channels.newChannel(output);
	     
	        ByteBuffer buffer = ByteBuffer.allocateDirect(10240);
	        while (inputChannel.read(buffer) != -1) {
	            buffer.flip();
	            size += outputChannel.write(buffer);
	            buffer.clear();
	        }
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
	    return size;
	}
	
	private String getParamValue(String paramKey, Map<String, String[]> paramsObj){
		String paramVal="";
		if(paramsObj!=null){
			String[] datArr ;
			for ( Map.Entry<String, String[]> entry : paramsObj.entrySet()) {
			    String key = entry.getKey();
			    if(paramKey.equalsIgnoreCase(key)){
			    	datArr = entry.getValue();
			    	if(datArr!=null && datArr.length>0){
			    		paramVal = datArr[0];
					}
			    	break;
			    }
			}    
		}else{
			paramVal = "";
		}
		return paramVal;
	}
	
	private String[] getParamArr(String paramKey,Map<String, String[]> paramsObj){
		
		String[] datArr=null ;
		if(paramsObj!=null){
			for ( Map.Entry<String, String[]> entry : paramsObj.entrySet()) {
			    String key = entry.getKey();
			    if(paramKey.equalsIgnoreCase(key)){
			    	datArr = entry.getValue();
			    	break;
			    }
			}    
		}
		return datArr;
	}
	
		
	private HttpURLConnection configUrlConnection(String targetUrlStr, String requestMethod) throws Exception {
		HttpURLConnection httpConn = null;
		URL httpsURL;
		try {
			if(targetUrlStr!=null)	targetUrlStr = targetUrlStr.trim();
			httpsURL = new URL(targetUrlStr);
			//Do some security checking skip when HTTPS
	        String[] strProtocal = targetUrlStr.split(":");
	        if(strProtocal != null && strProtocal.length>0){
	            if(strProtocal[0].equalsIgnoreCase("HTTPS")){
					//boolean trustAnyCertificate = CMConfiguration.getInstanceOf().getTrustAnyCertificate();
		            if(CMConfiguration.getInstanceOf().getTrustAnyCertificate()){
		                SSLContext context = SSLContext.getInstance("SSL");
		                context.init(null, new TrustManager[]{new TrustAnyTrustManager()}, new SecureRandom());
		                
		                httpConn = (HttpsURLConnection) httpsURL.openConnection();
		                ((HttpsURLConnection) httpConn).setSSLSocketFactory(context.getSocketFactory());
		                ((HttpsURLConnection) httpConn).setHostnameVerifier(new TrustAnyHostnameVerifier());		                
		                //httpConn.connect();
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

	private void updateResponseObject(RESTHelper helper, HttpURLConnection httpConn, int responseCode, String encoding, String errMsg) {
		String defaultResponse="";
		if(httpConn!=null) {
			InputStream inputStream = httpConn.getErrorStream();
			if(inputStream!=null){
				defaultResponse = dataStrUtils(inputStream, encoding);
			}
			if( !(responseCode>0)){
				defaultResponse += errMsg + defaultResponse;
			}
		}
		helper.setErrorString(responseCode, String.valueOf(responseCode), defaultResponse);
	}

	private String dataStrUtils(InputStream inputStr, String encoding) {
		StringWriter writer = new StringWriter();
		String jsonString = "";
		try {
			org.apache.commons.io.IOUtils.copy(inputStr, writer, encoding);
			jsonString = writer.toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return jsonString;
	}
}

