package com.springdata.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.springdata.model.UserDetail;

@Repository
public interface UserDetailRepository extends MongoRepository<UserDetail, Long>{
	
}
