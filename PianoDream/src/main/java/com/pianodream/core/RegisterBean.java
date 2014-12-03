package com.pianodream.core;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.faces.context.FacesContext;

import org.apache.log4j.Logger;
import org.primefaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.pianodream.model.Account;
import com.pianodream.service.AccountService;
import com.pianodream.util.CommonUtils;
import com.pianodream.util.Constant;
import com.pianodream.util.MailService;

@Component("RegisterBean")
public class RegisterBean implements Serializable {

	private static final long serialVersionUID = 1L;

	static final Logger logger = Logger.getLogger(RegisterBean.class);

	private String rePass = "";

	@Autowired
	AccountService accountService;

	@Autowired
	MailService mailService;

	private Account account;

	public RegisterBean() {
		super();
		reset();
	}

	public void reset() {
		account = new Account();
	}

	public String register(){

		if(!rePass.equals(account.getPassword())) {
			CommonUtils.addErrorMsg(null, "Password doesn't match !", "");
			return "";
		}

		if(accountService.findByUserName(account.getUserName()) != null){
			CommonUtils.addErrorMsg(null, "Username is existed !", "");
			return "";
		}
		if(accountService.findByEmail(account.getEmail()) != null){
			CommonUtils.addErrorMsg(null, "Email is existed", "");
			return "";
		}

		account.setPassword(CommonUtils.base64Encode(account.getPassword().getBytes()));
		account.setRole(Constant.ROLE_USER);
		account.setCreatedDate(new Date());
		accountService.add(account);

		mailService.sendMail("snowinrain90@gmail.com", account.getEmail(), "::: Welcome to Piano Dream :::", "Hi " + account.getUserName() + ", <br/> Thank you for registering account in Piano Dream. Hope you have a sweet moment ! <br/> Regards, <br/> AllStarGroup");

		logger.info(account.getUserName() + " registered successfully with role " + account.getRole());

		CommonUtils.addSuccessMsg("You registered successfully !");

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

			String[] splittedFileName = fileName.split("\\.");
			fileName = splittedFileName[0].concat("_" + UUID.randomUUID().toString()) + "." + splittedFileName[1].toLowerCase();

			// write the inputStream to a FileOutputStream
			String uploadPath = FacesContext.getCurrentInstance().getExternalContext().getRealPath("/") + Constant.UPLOAD_AVATAR_DESTINATION + fileName;
			OutputStream out = new FileOutputStream(new File(uploadPath));
			int read = 0;
			byte[] bytes = new byte[1024];

			// Refer META-INF/context.xml
			account.setAvatar("/images/avatar/"+fileName);

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

	public String getRePass() {
		return rePass;
	}

	public void setRePass(String rePass) {
		this.rePass = rePass;
	}
}
