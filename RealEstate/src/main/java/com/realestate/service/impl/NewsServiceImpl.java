package com.realestate.service.impl;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.realestate.model.Account;
import com.realestate.model.Article;
import com.realestate.model.News;
import com.realestate.model.TopAccount;
import com.realestate.repository.NewsRepository;
import com.realestate.service.NewsService;
import com.realestate.util.Constant;

@Service
public class NewsServiceImpl implements NewsService, Serializable{

	private static final long serialVersionUID = 1L;

	@Autowired
	NewsRepository newsRepository;

	@Autowired
	MongoTemplate mongoTemplate;

	@Override
	public void add(News news) {
		newsRepository.save(news);
	}

	@Override
	public void edit(News news) {
		newsRepository.save(news);
	}

	@Override
	public void delete(News news) {
		newsRepository.delete(news);
	}

	/**
	 * find News which created in date range.
	 */
	@Override
	public List<News> getNewsinRange(Date fromDate, Date toDate) {
		return newsRepository.findByCreatedDateBetween(fromDate, toDate);
	}

	/**
	 * find News has status is Active/Closed.
	 */
	@Override
	public List<News> getActiveNews(String status) {
		return newsRepository.findByStatus(status);
	}

	@Override
	public List<News> getRecentlyNews(int limit) {
		Query query = new Query();
		query.limit(limit);
		query.with(new Sort(Sort.Direction.DESC, "createdDate"));

		Criteria criteria = new Criteria();
		criteria = Criteria.where("status").is(Constant.STATUS_ACTIVE);

		query.addCriteria(criteria);

		return (List<News>) mongoTemplate.find(query, News.class);
	}

	@Override
	public List<News> getMostViewedNews(int limit) {
		Query query = new Query();
		query.limit(limit);
		query.with(new Sort(Sort.Direction.DESC, "viewNum"));

		Criteria criteria = new Criteria();
		criteria = Criteria.where("status").is(Constant.STATUS_ACTIVE);

		query.addCriteria(criteria);

		return (List<News>) mongoTemplate.find(query, News.class);
	}

	/**
	 * @param sortBy 1: createdDate; 2: viewNum; 3: updatedDate
	 */
	@Override
	public List<News> searchNews(int city, int district, String houseType, String exchangeType,
			String bedRoom, String bathRoom, String livingRoom, String minPrice, String maxPrice, String currency, String minSize, String maxSize, int sortBy) {

		minPrice = minPrice.replaceAll(",", "");
		maxPrice = maxPrice.replaceAll(",", "");

		Sort sort = null;
		if(sortBy == 1) {
			sort = new Sort(Sort.Direction.DESC, "createdDate");
		} else if (sortBy == 2) {
			sort = new Sort(Sort.Direction.DESC, "viewNum");
		} else if (sortBy == 3) {
			sort = new Sort(Sort.Direction.DESC, "updatedDate");
		}

		Criteria criteria = new Criteria();
		criteria = Criteria.where("status").is(Constant.STATUS_ACTIVE);

		if(city != 0) {
			criteria = criteria.and("city").is(city);
		}

		if(district != 0) {
			criteria = criteria.and("district").is(district);
		}

		if(!StringUtils.isBlank(houseType)) {
			criteria = criteria.and("houseType").is(houseType);
		}

		if(!StringUtils.isBlank(exchangeType)) {
			criteria = criteria.and("exchangeType").is(exchangeType);
		}

		if(!StringUtils.isBlank(bedRoom)) {
			criteria = criteria.and("bedRoom").is(Integer.valueOf(bedRoom));
		}

		if(!StringUtils.isBlank(bathRoom)) {
			criteria = criteria.and("bathRoom").is(Integer.valueOf(bathRoom));
		}

		if(!StringUtils.isBlank(livingRoom)) {
			criteria = criteria.and("livingRoom").is(Integer.valueOf(livingRoom));
		}

		if(!StringUtils.isBlank(minPrice) && !StringUtils.isBlank(maxPrice)) {
			criteria = criteria.andOperator(
							Criteria.where("price").gte(Long.valueOf(minPrice)),
							Criteria.where("price").lte(Long.valueOf(maxPrice))
						);
		} else {
			if(!StringUtils.isBlank(minPrice)) {
				criteria = criteria.and("price").gte(Long.valueOf(minPrice));
			}

			if(!StringUtils.isBlank(maxPrice)) {
				criteria = criteria.and("price").lte(Long.valueOf(maxPrice));
			}
		}

		if(!StringUtils.isBlank(currency)) {
			criteria = criteria.and("currency").is(currency);
		}

		if(!StringUtils.isBlank(minSize) && !StringUtils.isBlank(maxSize)) {
			criteria = criteria.andOperator(
							Criteria.where("size").gte(Float.valueOf(minSize)),
							Criteria.where("size").lte(Float.valueOf(maxSize))
						);
		} else {
			if(!StringUtils.isBlank(minSize)) {
				criteria = criteria.and("size").gte(Float.valueOf(minSize));
			}

			if(!StringUtils.isBlank(maxSize)) {
				criteria = criteria.and("size").lte(Float.valueOf(maxSize));
			}
		}

		// List all fields in News entity
		ArrayList<String> s = new ArrayList<String>();
		for(Field fields : News.class.getDeclaredFields()) {
			 if(!fields.getName().equals("serialVersionUID"))
				 s.add(fields.getName());
		}

		String[] fields = new String[s.size()];
		fields = s.toArray(fields);

		ProjectionOperation operation = Aggregation.project(fields).and("width").multiply("length").as("size");
		TypedAggregation<News> agg =  Aggregation.newAggregation(News.class, operation, Aggregation.match(criteria), Aggregation.sort(sort));
		AggregationResults<News> result = mongoTemplate.aggregate(agg, News.class);
		List<News> resultList = result.getMappedResults();

		return resultList;
	}


	@Override
	public News getById(String id) {
		return newsRepository.findById(id);
	}


	/**
	 * @param limit Number of Top Accounts
	 */
	@Override
	public List<TopAccount> getTopAccount(int limit) {
		TypedAggregation<News> agg =  Aggregation.newAggregation(
				News.class,
				Aggregation.group("account").count().as("newsNum"),
				Aggregation.project("newsNum").and("account").previousOperation(),
				Aggregation.sort(Sort.Direction.DESC, "newsNum"),
				Aggregation.limit(limit)
				);
		AggregationResults<TopAccount> result = mongoTemplate.aggregate(agg, TopAccount.class);
		return result.getMappedResults();
	}

	@Override
	public List<News> getByAccount(Account account) {
		Query query = new Query();
		query.with(new Sort(Sort.Direction.DESC, "createdDate"));

		Criteria criteria = new Criteria();
		criteria = Criteria.where("account").is(account);

		query.addCriteria(criteria);

		return (List<News>) mongoTemplate.find(query, News.class);

	}

	@Override
	public String updateExpiredNews(Date expirationDate) {
		StringBuilder ids = new StringBuilder();
		List<News> expiredNews = newsRepository.findExpiredNews(expirationDate);
		for(News news : expiredNews) {
			news.setStatus(Constant.STATUS_CLOSED);
			newsRepository.save(news);
			ids.append(news.getId() + " | ");
		}

		return ids.toString();
	}


}
