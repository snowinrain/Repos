package com.realestate.common;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.apache.log4j.Logger;
import org.primefaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.realestate.model.Account;
import com.realestate.model.AccountDetail;
import com.realestate.service.AccountService;
import com.realestate.util.CommonUtils;
import com.realestate.util.Constant;
import com.realestate.util.MailService;

@Component("LoginBean")
@Scope("session")
public class LoginBean implements Serializable {

	private static final long serialVersionUID = 6361017448750047324L;

	private boolean isRemember;
	private Account account;
	private boolean hasCookie = false;
	private boolean isForgotPass = false;

	private String oldPass;
	private String newPass;
	private String reNewPass;
	private String email;
	private String forgotEmail;
	private String userName;


	static final Logger logger = Logger.getLogger(LoginBean.class);

	@Autowired
	AccountService accountService;

	@Autowired
	MailService mailService;

	@Autowired
    private AuthenticationManager authenticationManager;

	public LoginBean(){
		super();
		account = new Account();
	}

	@PostConstruct
	private void init(){
	}

	public String login() {
        try {
        	Authentication request = new UsernamePasswordAuthenticationToken(account.getUserName(), CommonUtils.base64Encode(account.getPassword().getBytes()));
            Authentication result = authenticationManager.authenticate(request);
            SecurityContextHolder.getContext().setAuthentication(result);
            logger.info(account.getUserName() + " loggged in !");

            userName = account.getUserName();
            account = accountService.getAccountByUserName(userName);
            if(account == null) {
    			account =  accountService.getAccountByEmail(userName);
    		}

            userName = account.getUserName();
            email = account.getEmail();

        	return Constant.PAGE_NEWS_INDEX;

        } catch (AuthenticationException e) {
        	CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.login"), "");
        	logger.error(CommonUtils.getLocaleMessage("error.login"));
        	account = new Account();
        	return "";
        }
    }

	public void changePassword() throws IOException {
		if(!oldPass.equals(new String(CommonUtils.base64Decode(account.getPassword())))) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.match.oldPassword"), "");
		} else if (!newPass.equals(reNewPass)) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.match.newPassword"), "");
		} else {
			logger.info(account.getUserName() + " edited successfully with role " + account.getRole());
			CommonUtils.addSuccessMsg(CommonUtils.getLocaleMessage("success.changePassword"));
		}
	}

	public void editProfile() {

		if(!email.equals(account.getEmail()) && accountService.getAccountByEmail(account.getEmail()) != null){
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.email.unavailable"), "");
		} else {
			accountService.edit(account);

			logger.info(account.getUserName() + " edited successfully with role " + account.getRole());

			CommonUtils.addSuccessMsg(CommonUtils.getLocaleMessage("success.editProfile"));
		}
	}

	public void forgotPassword() throws IOException {
		Account acc = accountService.getAccountByEmail(forgotEmail);
		if(acc == null) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.email.unavailable"), "");
		} else {
			isForgotPass = true;
			mailService.sendMail("snowinrain90@gmail.com", acc.getEmail(), CommonUtils.getLocaleMessage("email.forgotPassword.subject"), CommonUtils.getLocaleMessage("email.forgotPassword.body") + new String(CommonUtils.base64Decode(acc.getPassword())));
			forgotEmail = "";
		}
	}

	public void reset() {
		account = accountService.getAccountByUserName(userName);
        if(account == null) {
 			account =  accountService.getAccountByEmail(email);
 		}
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

	public String logout() throws IOException{
		String returnPage = "";
		logger.info(account.getUserName() + " loggged out !");

		if(account.getRole().equals(Constant.ROLE_USER))
        	returnPage = Constant.PAGE_NEWS_INDEX;
        else
        	returnPage = Constant.PAGE_LOGIN;

		account = new Account();
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		context.redirect(context.getRequestContextPath() + "/j_spring_security_logout");
		FacesContext.getCurrentInstance().responseComplete();

		CommonUtils.removeBean("accountBean");
		CommonUtils.removeBean("feeBean");
		CommonUtils.removeBean("InstallmentBean");
		CommonUtils.removeBean("installmentDueDateBean");
		CommonUtils.removeBean("miscExpenseBean");
		CommonUtils.removeBean("miscPaymentBean");
		CommonUtils.removeBean("paymentBean");
		CommonUtils.removeBean("searchStudentBean");
		CommonUtils.removeBean("StudentBean");
		CommonUtils.removeBean("LoginBean");

		return returnPage;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public boolean isRemember() {
		return isRemember;
	}

	public void setRemember(boolean isRemember) {
		this.isRemember = isRemember;
	}

	public boolean isHasCookie() {
		return hasCookie;
	}

	public void setHasCookie(boolean hasCookie) {
		this.hasCookie = hasCookie;
	}

	public String getNewPass() {
		return newPass;
	}

	public void setNewPass(String newPass) {
		this.newPass = newPass;
	}

	public String getReNewPass() {
		return reNewPass;
	}

	public void setReNewPass(String reNewPass) {
		this.reNewPass = reNewPass;
	}

	public String getOldPass() {
		return oldPass;
	}

	public void setOldPass(String oldPass) {
		this.oldPass = oldPass;
	}

	public String getForgotEmail() {
		return forgotEmail;
	}

	public void setForgotEmail(String forgotEmail) {
		this.forgotEmail = forgotEmail;
	}

	public boolean isForgotPass() {
		return isForgotPass;
	}

	public void setForgotPass(boolean isForgotPass) {
		this.isForgotPass = isForgotPass;
	}
}
