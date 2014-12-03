package com.realestate.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class TopAccount {

	private Account account;
	int newsNum;

	public int getNewsNum() {
		return newsNum;
	}
	public void setNewsNum(int newsNum) {
		this.newsNum = newsNum;
	}
	public Account getAccount() {
		return account;
	}
	public void setAccount(Account account) {
		this.account = account;
	}
}