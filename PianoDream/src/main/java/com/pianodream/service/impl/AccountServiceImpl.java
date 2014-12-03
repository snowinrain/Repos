package com.pianodream.service.impl;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pianodream.model.Account;
import com.pianodream.repository.AccountRepository;
import com.pianodream.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService, Serializable{

	private static final long serialVersionUID = 1L;

	@Autowired
	AccountRepository accountRepository;

	@Override
	public void add(Account account) {
		// TODO Auto-generated method stub
		accountRepository.save(account);
	}

	@Override
	public void edit(Account account) {
		// TODO Auto-generated method stub
		accountRepository.save(account);
	}

	@Override
	public void delete(Account account) {
		accountRepository.delete(account);
	}

	@Override
	public Account findByUserName(String userName) {
		if(!accountRepository.findByUserName(userName).isEmpty()) {
			return accountRepository.findByUserName(userName).get(0);
		}
		return null;
	}

	@Override
	public Account findByEmail(String email) {
		if(!accountRepository.findByEmail(email).isEmpty()) {
			return accountRepository.findByEmail(email).get(0);
		}

		return null;
	}

	@Override
	public List<Account> findAll() {
		return accountRepository.findAll();
	}
}
