package com.pianodream.service.impl;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pianodream.model.Account;
import com.pianodream.model.Video;
import com.pianodream.repository.AccountRepository;
import com.pianodream.repository.VideoRepository;
import com.pianodream.service.AccountService;
import com.pianodream.service.VideoService;

@Service
public class VideoServiceImpl implements VideoService, Serializable{

	private static final long serialVersionUID = 1L;

	@Autowired
	VideoRepository videoRepository;

	@Override
	public void add(Video video) {
		videoRepository.save(video);
	}

	@Override
	public void edit(Video video) {
		videoRepository.save(video);
	}

	@Override
	public void delete(Video video) {
		videoRepository.delete(video);
	}

	@Override
	public List<Video> findByAccount(Account account) {
		return videoRepository.findByAccount(account);
	}

}
