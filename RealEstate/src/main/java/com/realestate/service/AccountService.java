package com.realestate.service;

import java.util.List;

import com.realestate.model.Account;


public interface AccountService {
	public void add(Account account);
	public void edit(Account account);
	public void delete(Account account);
	public Account getAccountByUserName(String UserName);
	public Account getAccountByEmail(String Email);
	public List<Account> getAccounts();
	public List<Account> getNewAccounts();
}
