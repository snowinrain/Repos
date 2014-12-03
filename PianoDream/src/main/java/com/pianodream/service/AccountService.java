package com.pianodream.service;

import java.util.List;

import com.pianodream.model.Account;


public interface AccountService {
	public void add(Account account);
	public void edit(Account account);
	public void delete(Account account);
	public Account findByUserName(String UserName);
	public Account findByEmail(String Email);
	public List<Account> findAll();
}
