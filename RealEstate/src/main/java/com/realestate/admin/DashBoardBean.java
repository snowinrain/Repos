package com.realestate.admin;

import java.io.Serializable;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.model.Account;
import com.realestate.service.AccountService;

@Component("DashBoardBean")
@Scope("request")
public class DashBoardBean implements Serializable {

	private static final long serialVersionUID = 6361017448750047324L;

	private Account account;

	private int newUserNum;
	private int newUserPercent;

	static final Logger logger = Logger.getLogger(DashBoardBean.class);

	@Autowired
	AccountService accountService;


	public DashBoardBean(){
	}

	@PostConstruct
	private void init(){
		newUserNum = accountService.getNewAccounts().size();
		newUserPercent =  newUserNum / accountService.getAccounts().size() * 100;
	}

	public int getNewUserNum() {
		return newUserNum;
	}

	public void setNewUserNum(int newUserNum) {
		this.newUserNum = newUserNum;
	}

	public int getNewUserPercent() {
		return newUserPercent;
	}

	public void setNewUserPercent(int newUserPercent) {
		this.newUserPercent = newUserPercent;
	}
}
