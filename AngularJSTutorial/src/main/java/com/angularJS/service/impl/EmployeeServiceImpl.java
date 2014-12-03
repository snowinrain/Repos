package com.angularJS.service.impl;

import java.util.List;

import org.apache.commons.collections.IteratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.angularJS.model.Employee;
import com.angularJS.repository.EmployeeRepository;
import com.angularJS.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService{
	@Autowired
	EmployeeRepository employeeRepository;

	@Autowired
	MongoTemplate mongoTemplate;

	@Override
	public List<Employee> findAll() {
		return IteratorUtils.toList(employeeRepository.findAll().iterator());
	}

	@Override
	public Employee saveOrUpdate(Employee emp) {
		return employeeRepository.save(emp);
	}

	@Override
	public void delete(String id) {
		employeeRepository.delete(findOne(id));
	}

	@Override
	public Employee findOne(String id) {
		return employeeRepository.findOne(id);
	}

	@Override
	public Page<Employee> findWithPagination(int pageNum, int pageSize, String sortBy,	Direction direction) {
		return employeeRepository.findAll(new PageRequest(pageNum, pageSize, direction, sortBy));
	}
}
