package com.angularJS.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.angularJS.model.Employee;

@Repository
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, String> {
	Employee findOneByEmail(String email);
}
