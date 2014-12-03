package com.realestate.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.realestate.model.Account;

@Repository
public interface AccountRepository extends MongoRepository<Account, Long> {
	List<Account> findByUserName(String userName);
	List<Account> findByEmail(String email);

	@Query("{ 'userName' : ?0, 'password' : ?1 }")
	List<Account> authenticateUser(String userName, String password);

	List<Account> findByCreatedDateBetween(Date fromDate, Date toDate);
}
