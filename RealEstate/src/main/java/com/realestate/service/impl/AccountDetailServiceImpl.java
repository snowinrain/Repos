package com.realestate.service.impl;

import java.io.Serializable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realestate.model.AccountDetail;
import com.realestate.repository.AccountDetailRepository;
import com.realestate.service.AccountDetailService;

@Service
public class AccountDetailServiceImpl implements AccountDetailService, Serializable{

	private static final long serialVersionUID = 1L;

	@Autowired
	AccountDetailRepository accountDetailRepository;

	@Override
	public void add(AccountDetail accountDetail) {
		accountDetailRepository.save(accountDetail);
	}

	@Override
	public void edit(AccountDetail accountDetail) {
		accountDetailRepository.save(accountDetail);
	}

	@Override
	public void delete(AccountDetail accountDetail) {
		accountDetailRepository.delete(accountDetail);
	}

}
