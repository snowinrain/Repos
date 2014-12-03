package com.realestate.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestate.model.AccountDetail;

@Repository
public interface AccountDetailRepository extends MongoRepository<AccountDetail, Long>{
	
}
