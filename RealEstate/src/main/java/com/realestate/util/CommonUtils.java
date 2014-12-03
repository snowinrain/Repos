package com.realestate.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.primefaces.context.RequestContext;


public class CommonUtils {

	public static void addErrorMsg(String ComponentID, String Summary, String Detail){
		 FacesMessage msg = new FacesMessage(FacesMessage.SEVERITY_ERROR, Summary, Detail);
	     FacesContext.getCurrentInstance().addMessage(ComponentID, msg);
	}

	public static void addInfoMsg(String ComponentID, String Summary, String Detail){
		 FacesMessage msg = new FacesMessage(FacesMessage.SEVERITY_INFO, Summary, Detail);
	     FacesContext.getCurrentInstance().addMessage(ComponentID, msg);
	}

	public static List<SelectItem> getPropertyValue(String pathFile, String prefix) {
		String[] values = null;
		Map<String, SelectItem> map = new TreeMap<String, SelectItem>();

		ResourceBundle resources = ResourceBundle.getBundle(pathFile, FacesContext.getCurrentInstance().getViewRoot().getLocale());
		Enumeration<String> keys = resources.getKeys();

		while (keys.hasMoreElements()) {
			String key = (String) keys.nextElement();
			if(StringUtils.isBlank(prefix)) {
				map.put(key, new SelectItem(key, resources.getString(key)));
			}
			else if (key.startsWith(prefix)) {
				values = key.split("_");
				map.put(values[values.length - 1], new SelectItem(values[values.length - 1], resources.getString(key)));
			}
		}

		return new ArrayList<SelectItem>(map.values());
	}

	/**
	 * Add a value to session context.
	 *
	 * @param key
	 *            the key to add a value
	 * @param value
	 *            the value is added to session context.
	 */
	public static void addValueToSession(String key, Object value) {
		FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
				.put(key, value);
	}

	/**
	 * Remove a value to session context.
	 *
	 * @param key
	 *            the key to add a value
	 * @param value
	 *            the value is added to session context.
	 */
	public static void removeSession(String key) {
		FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
				.remove(key);
	}

	/**
	 * Find (get) a value from session context.
	 *
	 * @param key
	 *            the key to find
	 * @return the value from session context
	 */
	public static Object getValueFromSession(String key) {
		return FacesContext.getCurrentInstance().getExternalContext()
				.getSessionMap().get(key);
	}

	/**
	 * @param key
	 * @param value
	 */
	public static void addValueToCookie(String key, String value, int maxAge) {
		Cookie cookie = new Cookie(key, value);
		cookie.setMaxAge(maxAge); // a week
		cookie.setPath("/");
		getResponse().addCookie(cookie);
	}

	/**
	 * @return HttpServletResponse
	 */
	public static HttpServletResponse getResponse() {
		return (HttpServletResponse) getFacesContext().getExternalContext()
				.getResponse();
	}

	/**
	 * @param key
	 * @return the value from cookie content
	 */
	public static String getValueFromCookie(String key) {
		Cookie[] cookies = getRequest().getCookies();
		String value = "";
		if(cookies != null){
			for (Cookie cookie : cookies) {
				if(key.equals(cookie.getName())) {
					value = cookie.getValue();
				}
			}
		}
		return value;
	}

	/**
	 * @param key
	 * @return the cookie contain key
	 */
	public static Cookie getCookieByKey(String key) {
		Cookie[] cookies = getRequest().getCookies();
		if(cookies != null){
			for (Cookie cookie : cookies) {
				if(key.equals(cookie.getName())) {
					return cookie;
				}
			}
		}
		return null;
	}

	/**
	 * Remove cookie
	 * @param key
	 * @return the value from cookie content
	 */
	public static void removeCookie(String key) {
		Cookie[] cookies = getRequest().getCookies();
		if(cookies != null){
			for (Cookie cookie : cookies) {
				if(key.equals(cookie.getName())) {
					cookie.setMaxAge(0);
					cookie.setValue("");
					cookie.setPath("/");
					getResponse().addCookie(cookie);
				}
			}
		}
	}

	/**
	 *
	 * @return FaceContext
	 */
	public static FacesContext getFacesContext() {
		return FacesContext.getCurrentInstance();
	}

	/**
	 * @return HttpServletRequest
	 */
	public static HttpServletRequest getRequest() {
		return (HttpServletRequest) getFacesContext().getExternalContext()
				.getRequest();
	}

	/**
	 * Remove a bean from context.
	 *
	 * @param beanName
	 *            name's bean will be removed
	 */
	public static void removeBean(String beanName) {
		FacesContext.getCurrentInstance().getExternalContext().getSessionMap()
				.remove(beanName);
	}

	/**
	 * @param date
	 * @param fromFormatDate
	 * @param toFormatDate
	 * @return String
	 */
	public static String convertDateFormatType(String date, SimpleDateFormat fromFormatDate, SimpleDateFormat toFormatDate) {
		try {
			return toFormatDate.format(fromFormatDate.parse(date));
		} catch (ParseException e) {
			return null;
		}
	}

	/**
	 * Load properties from property file.
	 * @param path of file
	 * @return properties
	 */
	public static Properties getPropertyFile(String path) {
		Properties propertiesFile = new Properties();
		ClassLoader classLoader = Thread.currentThread()
				.getContextClassLoader();
		InputStream input = classLoader.getResourceAsStream(path);
		try {
			propertiesFile.load(input);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return propertiesFile;
	}

	/**
     * Validate Email.
     *
     * @param emailAddress
     *            the Email Address
     */
	public static boolean validateEmail(String emailAddress){
		String emailPattern = "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
        Pattern p = Pattern.compile(emailPattern);
        Matcher m = p.matcher(emailAddress);
        return m.matches();
	}

	/**
     * Validate Password.
     *
     * @param password
     *            the password string
     */
	public static boolean validatePassword(String password){
		String passwordPattern = "((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{7,16})";
        Pattern p = Pattern.compile(passwordPattern);
        Matcher m = p.matcher(password);
        return m.matches();
	}

	public static String base64Encode(byte[] bytes) {
        // NB: This class is internal, and you probably should use another impl
    	return Base64.encodeBase64String(bytes);
    }

	public static byte[] base64Decode(String property) throws IOException {
        // NB: This class is internal, and you probably should use another impl
    	return Base64.decodeBase64(property);
    }

	public static void addSuccessMsg(String message){
		RequestContext context = RequestContext.getCurrentInstance();
		CommonUtils.addInfoMsg("growl", message, "");
		context.update("growl");
	}

	/**
     * get Locale Message from resource bundle
     *
     * @param key
     *            key of message
     */
	public static String getLocaleMessage(String key) {
		return getFacesContext().getApplication().getResourceBundle(getFacesContext(), "msg").getString(key);
	}
}
