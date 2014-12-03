package com.realestate.service.impl;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realestate.model.Account;
import com.realestate.repository.AccountRepository;
import com.realestate.service.AccountService;

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
	public Account getAccountByUserName(String userName) {
		if(!accountRepository.findByUserName(userName).isEmpty()) {
			return accountRepository.findByUserName(userName).get(0);
		}
		return null;
	}

	@Override
	public Account getAccountByEmail(String email) {
		if(!accountRepository.findByEmail(email).isEmpty()) {
			return accountRepository.findByEmail(email).get(0);
		}

		return null;
	}

	@Override
	public List<Account> getAccounts() {
		return accountRepository.findAll();
	}


	/**
	 * find New Users who created from 1 week ago to now.
	 */
	@Override
	public List<Account> getNewAccounts() {
		Date toDate = new Date();

		// Calculate 1 week ago
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(toDate);
		calendar.add(Calendar.DAY_OF_YEAR, -7);
		Date fromDate = calendar.getTime();

		return accountRepository.findByCreatedDateBetween(fromDate, toDate);
	}
}
