package com.springdata.main;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.mongodb.core.MongoOperations;

import com.springdata.config.SpringMongoConfig;
import com.springdata.model.User;
import com.springdata.model.UserDetail;
import com.springdata.repository.UserDetailRepository;
import com.springdata.repository.UserRepository;

public class AppMain {
	
	/**
	 * Use XML : ApplicationContext use "META-INF/spring/app-context.xml"
	 * **/
	public static void main(String[] args) {
		ApplicationContext ctx = new ClassPathXmlApplicationContext("META-INF/spring/app-context.xml");

		MongoOperations mongoOperation = (MongoOperations) ctx.getBean("mongoTemplate");
		UserRepository userRepository = ctx.getBean(UserRepository.class);
		UserDetailRepository userDetailRepository = ctx.getBean(UserDetailRepository.class);
		
		if(userRepository == null){
			System.out.println("Null");
		} else{
			System.out.println("Connected to MongoDB successfully !");
			
//			User user = new User("tuanmap", "123456");
//			UserDetail userDetail = new UserDetail("Tuan", "Map", 32);
//			
//			userDetail = userDetailRepository.save(userDetail);
//			
//			user.setUserDetail(userDetail);
//			userRepository.save(user);
			
			System.out.println("User created 1: " + userRepository.findByUsername("tuanmap").get(0).getUsername());
			System.out.println("User created 2: " + userRepository.authenticateUser("tuanmap", "123456").get(0).getUserDetail().getFirstName());
		}
	}
	
	/**
	 * Use Annotation : ApplicationContext use SpringMongoConfig.class
	 * **/
//	public static void main(String[] args) {
//
//		ApplicationContext ctx = new AnnotationConfigApplicationContext(
//				SpringMongoConfig.class);	
//
//		UserRepository userRepository = ctx.getBean(UserRepository.class);
//		UserDetailRepository userDetailRepository = ctx.getBean(UserDetailRepository.class);
//
//		User user = new User("tuanmap", "123456");
//		UserDetail userDetail = new UserDetail("Tuan", "Map", 32);
//		
//		// save
////		serRepository.save(user);
//		user = userRepository.findByUsername("tuanmap").get(0);
//		userDetail = userDetailRepository.save(userDetail);
//		
//		// update
//		user.setUserDetail(userDetail);
//		userRepository.save(user);
//		
//		System.out.println("User created 1: " + userRepository.findByUsername("tuanmap").size());
//		System.out.println("User created 2: " + userRepository.authenticateUser("tuanmap", "123456").size());
//		
//
//	}

}
