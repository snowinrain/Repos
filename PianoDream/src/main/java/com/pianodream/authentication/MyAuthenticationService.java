package com.pianodream.authentication;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pianodream.model.Account;
import com.pianodream.service.AccountService;

@Service
public class MyAuthenticationService implements UserDetailsService {

	@Autowired
	private AccountService accountService;

	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		Account account = accountService.findByUserName(username);
		if(account == null) {
			account =  accountService.findByEmail(username);
		}

		List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>();
		authList.add(new SimpleGrantedAuthority(account.getRole()));

		User userDetail = new User(account.getUserName(), account.getPassword(), true, true, true, true, authList);
		return userDetail;
	}

}