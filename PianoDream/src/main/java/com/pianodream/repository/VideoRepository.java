package com.pianodream.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.pianodream.model.Account;
import com.pianodream.model.Video;

@Repository
public interface VideoRepository extends MongoRepository<Video, Long> {
	public List<Video> findByAccount(Account account);
}
