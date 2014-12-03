package com.angularJS.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;

import com.angularJS.model.Employee;

public interface EmployeeService {
	public List<Employee> findAll();
	public Employee findOne(String id);
	public Employee saveOrUpdate(Employee emp);
	public void delete(String id);
	public Page<Employee> findWithPagination(int pageNum, int pageSize, String sortBy,	Direction direction);
}
