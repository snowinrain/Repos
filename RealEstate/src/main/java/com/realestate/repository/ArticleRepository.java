package com.realestate.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.realestate.model.Account;
import com.realestate.model.Article;

@Repository
public interface ArticleRepository extends MongoRepository<Article, Long> {
	@Query("{ 'createdDate' : {$gt: ?0, $lt : ?1}, 'status' : 'ACTIVE'}")
	List<Article> findByCreatedDateBetween(Date fromDate, Date toDate);
	List<Article> findByAccount(Account account);
	List<Article> findByCategory(int category);
	Article findById(String id);
}
