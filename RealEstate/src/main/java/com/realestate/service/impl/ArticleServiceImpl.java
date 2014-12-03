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
import com.realestate.repository.ArticleRepository;
import com.realestate.repository.NewsRepository;
import com.realestate.service.ArticleService;
import com.realestate.service.NewsService;
import com.realestate.util.Constant;

@Service
public class ArticleServiceImpl implements ArticleService, Serializable{

	private static final long serialVersionUID = 1L;

	@Autowired
	ArticleRepository articleRepository;

	@Autowired
	MongoTemplate mongoTemplate;

	@Override
	public void add(Article article) {
		articleRepository.save(article);
	}

	@Override
	public void edit(Article article) {
		articleRepository.save(article);
	}

	@Override
	public void delete(Article article) {
		articleRepository.delete(article);
	}

	@Override
	public List<Article> findLimit(int limit) {
		Query query = new Query();
		query.limit(limit);
		query.with(new Sort(Sort.Direction.DESC, "createdDate"));

		return (List<Article>) mongoTemplate.find(query, Article.class);
	}

	@Override
	public List<Article> findAll() {
		Query query = new Query();
		query.with(new Sort(Sort.Direction.DESC, "createdDate"));

		return (List<Article>) mongoTemplate.find(query, Article.class);
	}

	@Override
	public List<Article> findByCategory(int category) {
		Query query = new Query();
		query.with(new Sort(Sort.Direction.DESC, "createdDate"));

		Criteria criteria = new Criteria();
		criteria = Criteria.where("category").is(category);

		query.addCriteria(criteria);

		return (List<Article>) mongoTemplate.find(query, Article.class);
	}

	@Override
	public List<Article> findByAccount(Account account) {
		Query query = new Query();
		query.with(new Sort(Sort.Direction.DESC, "createdDate"));

		Criteria criteria = new Criteria();
		criteria = Criteria.where("account").is(account);

		query.addCriteria(criteria);

		return (List<Article>) mongoTemplate.find(query, Article.class);
	}
}
