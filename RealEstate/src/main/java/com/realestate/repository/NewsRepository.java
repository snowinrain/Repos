package com.realestate.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.realestate.model.Account;
import com.realestate.model.News;

@Repository
public interface NewsRepository extends MongoRepository<News, Long> {
	@Query("{ 'createdDate' : {$gt: ?0, $lt : ?1}, 'status' : 'ACTIVE'}")
	List<News> findByCreatedDateBetween(Date fromDate, Date toDate);
	List<News> findByStatus(String status);
	List<News> findByAccount(Account account);
	News findById(String id);

	@Query("{ 'city' : ?0, 'district' : ?1, 'houseType' : ?2, 'bedRoom' : ?3, 'bathRoom' : ?4, 'livingRoom' : ?5, 'status' : 'CLOSED'}")
	List<News> searchNews(int city, int district, int houseType, int bedRoom, int bathRoom, int livingRoom);

	@Query("{ 'expirationDate' : {$lt: ?0}, 'status' : 'ACTIVE'}")
	List<News> findExpiredNews(Date expirationDate);
}
