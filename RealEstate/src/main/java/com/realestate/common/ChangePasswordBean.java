package com.realestate.common;

import java.io.Serializable;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("ChangePasswordBean")
@Scope("session")
public class ChangePasswordBean extends GeneralBean implements Serializable {

	private static final long serialVersionUID = -2866975231477784343L;

//	private Account account;
//
//	private String userName;
//	private String currentPassword;
//	private String newPassword;
//
//	static final Logger logger = Logger.getLogger(ChangePasswordBean.class);
//
//	@Autowired
//	IAccountService accountService;
//
//	public ChangePasswordBean(){
//		super();
//		account = new Account();
//		userName = "";
//		currentPassword = "";
//		newPassword = "";
//	}
//
//	@PostConstruct
//	private void init(){
//	}
//
//	public void changePassword(){
//		account.setUsername(userName);
//		account.setPassword(currentPassword);
//		RequestContext context = RequestContext.getCurrentInstance();
//
//		boolean isValid = accountService.checkAccount(account);
//		if(!isValid) {
//			CommonUtils.addErrorMsg("chgPassMsg", "Current Password is invalid", "");
//		} else {
//			account = accountService.getAccountByUserName(userName);
//			account.setPassword(CommonUtils.encryptPassword(newPassword));
//			accountService.editAccount(account);
//			CommonUtils.addInfoMsg("growl", "Your Password is changed successfully", "");
//			logger.info(account.getUsername() + " changed password successfully !");
//			context.update("growl");
//		}
//
//		context.addCallbackParam("isValid", isValid);
//	}
//
//	public String logout(){
//		CommonUtils.removeSession(Constant.USERNAME);
//		return getViewFromNameJsp("login?faces-redirect=true");
//	}
//
//	public Account getAccount() {
//		return account;
//	}
//
//	public void setAccount(Account account) {
//		this.account = account;
//	}
//
//	public IAccountService getAccountService() {
//		return accountService;
//	}
//
//	public void setAccountService(IAccountService accountService) {
//		this.accountService = accountService;
//	}
//
//	public String getUserName() {
//		return userName;
//	}
//
//	public void setUserName(String userName) {
//		this.userName = userName;
//	}
//
//	public String getCurrentPassword() {
//		return currentPassword;
//	}
//
//	public void setCurrentPassword(String currentPassword) {
//		this.currentPassword = currentPassword;
//	}
//
//	public String getNewPassword() {
//		return newPassword;
//	}
//
//	public void setNewPassword(String newPassword) {
//		this.newPassword = newPassword;
//	}


}
