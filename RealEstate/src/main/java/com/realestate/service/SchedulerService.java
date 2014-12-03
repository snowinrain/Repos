package com.realestate.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.realestate.model.Account;
import com.realestate.model.News;
import com.realestate.util.Constant;

@Service
public class SchedulerService {

	static final Logger logger = Logger.getLogger(SchedulerService.class);

	@Autowired
	private NewsService newsService;

	@Autowired
	private AccountService accountService;

	@Scheduled(cron="0 0 3 * * ?")
    public void updateExpiredNews()
    {
		logger.info("Update Expired News at 3:00 AM");
		String ids = newsService.updateExpiredNews(new Date());
		logger.info("List Expired News Ids : " + ids);
    }

//	@Scheduled(fixedDelay = 5000)
	public void updateNewsAndAccount() {
		List<News> newsLst = newsService.getActiveNews(Constant.STATUS_ACTIVE);
		for(News news : newsLst) {
			news.setFollower(new ArrayList<Account>());
			newsService.edit(news);
		}

		List<Account> accounts = accountService.getAccounts();
		for(Account account : accounts) {
			account.setFollowedNews(new ArrayList<News>());
			accountService.edit(account);
		}
	}

}
