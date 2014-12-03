package com.realestate.common;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.Date;

import javax.faces.context.FacesContext;

import org.apache.log4j.Logger;
import org.primefaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.realestate.model.Account;
import com.realestate.model.AccountDetail;
import com.realestate.service.AccountDetailService;
import com.realestate.service.AccountService;
import com.realestate.util.CommonUtils;
import com.realestate.util.Constant;
import com.realestate.util.MailService;

@Component("RegisterBean")
public class RegisterBean implements Serializable {

	private static final long serialVersionUID = 1L;

	static final Logger logger = Logger.getLogger(RegisterBean.class);

	private boolean isAgree = false;
	private String rePass = "";

	@Autowired
	AccountService accountService;

	@Autowired
	AccountDetailService accountDetailService;

	@Autowired
	MailService mailService;

	private Account account;

	public RegisterBean() {
		super();
		reset();
	}

	public void reset() {
		account = new Account();
		account.setAccountDetail(new AccountDetail());
	}

	public String register(){

		if(!rePass.equals(account.getPassword())) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("primefaces.password.INVALID_MATCH"), "");
			return "";
		}

		if(accountService.getAccountByUserName(account.getUserName()) != null){
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.username.unavailable"), "");
			return "";
		}
		if(accountService.getAccountByEmail(account.getEmail()) != null){
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.email.unavailable"), "");
			return "";
		}

		account.setPassword(CommonUtils.base64Encode(account.getPassword().getBytes()));
		account.setRole(Constant.ROLE_USER);
		account.setCreatedDate(new Date());
		accountDetailService.add(account.getAccountDetail());
		accountService.add(account);

		mailService.sendMail("snowinrain90@gmail.com", account.getEmail(), CommonUtils.getLocaleMessage("email.login.subject"), CommonUtils.getLocaleMessage("email.login.body"));

		logger.info(account.getUserName() + " registered successfully with role " + account.getRole());

		CommonUtils.addSuccessMsg(CommonUtils.getLocaleMessage("success.register"));

		reset();

		return "";
	}

	public void avatarUpload(FileUploadEvent event) {
		try {
			copyFile(event.getFile().getFileName(), event.getFile().getInputstream());
		} catch (IOException e) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.upload.image"), "");
			logger.error("Upload Avatar Error: " + e.getMessage());
			System.out.println("avatarUpload Error: " + e.getMessage());
		}
	}

	public void copyFile(String fileName, InputStream in) {
		try {
			// write the inputStream to a FileOutputStream
			String uploadPath = FacesContext.getCurrentInstance().getExternalContext().getRealPath("/") + Constant.UPLOAD_AVATAR_DESTINATION + fileName;
			OutputStream out = new FileOutputStream(new File(uploadPath));
			int read = 0;
			byte[] bytes = new byte[1024];

			// Refer META-INF/context.xml
			account.getAccountDetail().setAvatar("/images/avatar/"+fileName);

			while ((read = in.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}

			in.close();
			out.flush();
			out.close();

			logger.info("New avatar uploaded : " + uploadPath);
		} catch (IOException e) {
			System.out.println("Error Copy File: " + e.getMessage());
		}
	}


	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public boolean isAgree() {
		return isAgree;
	}

	public void setAgree(boolean isAgree) {
		this.isAgree = isAgree;
	}

	public String getRePass() {
		return rePass;
	}

	public void setRePass(String rePass) {
		this.rePass = rePass;
	}
}
