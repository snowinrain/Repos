package com.realestate.news;

import java.io.Serializable;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.common.LoginBean;
import com.realestate.util.CommonUtils;
import com.realestate.util.MailService;

@Component("ContactBean")
@Scope("request")
public class ContactBean implements Serializable {

	private static final long serialVersionUID = 1L;

	private String fullName;
	private String email;
	private String content;

	@Autowired
	private LoginBean loginBean;

	@Autowired
	private MailService mailService;

	public ContactBean() {
	}

	@PostConstruct
	public void init() {
		if(loginBean.getAccount() != null) {
			fullName = loginBean.getAccount().getAccountDetail().getFullName();
			email = loginBean.getAccount().getEmail();
		}
	}

	public void submitForm() {
		mailService.sendMail("snowinrain90@gmail.com", "nhanbyebye@yahoo.com.vn", CommonUtils.getLocaleMessage("email.contact.subject"), content + "\n From " + fullName + " - " + email);
		CommonUtils.addInfoMsg("growl", CommonUtils.getLocaleMessage("success.submitContact"), "");
		content = "";
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}


}
