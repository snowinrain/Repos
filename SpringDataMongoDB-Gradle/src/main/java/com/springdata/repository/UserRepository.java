package com.springdata.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.springdata.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
	List<User> findByUsername(String Username);
	
	List<User> findAll();
	
	@Query("{ 'username' : ?0, 'password' : ?1 }")
	List<User> authenticateUser(String Username, String Password);
}
