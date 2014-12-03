package com.angularJS.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.angularJS.model.Employee;
import com.angularJS.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
	@Autowired
	EmployeeService employeeService;

	@RequestMapping(value="/{id}", method=RequestMethod.GET)
	public Employee get(@PathVariable("id") String id) {
		return employeeService.findOne(id);
	}

//	@RequestMapping(method=RequestMethod.GET)
//	public List<Employee> getEmployeesList() {
//		System.out.println("aaaa");
//		return employeeService.findAll();
//	}

	@RequestMapping(value="/{id}", method=RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteEmployee(@PathVariable("id") String id) {
		employeeService.delete(id);
		return new ResponseEntity<Boolean>(Boolean.TRUE, HttpStatus.OK);
	}

	@RequestMapping(method=RequestMethod.POST)
	public Employee addEmp(@RequestBody Employee emp) {
		return employeeService.saveOrUpdate(emp);
	}

	@RequestMapping(value="/{id}", method=RequestMethod.POST)
	public Employee editEmp(@PathVariable("id") String id, @RequestBody Employee emp) {
		return employeeService.saveOrUpdate(emp);
	}

	@RequestMapping(method=RequestMethod.GET)
	public Page<Employee> pagingList(@RequestParam("pageNum") int pageNum, @RequestParam("pageSize") int pageSize, @RequestParam("direction") int direction, @RequestParam("sortBy") String sortBy) {
		if (direction == 0) {
			return employeeService.findWithPagination(pageNum, pageSize, sortBy, Direction.ASC);
		} else {
			return employeeService.findWithPagination(pageNum, pageSize, sortBy, Direction.DESC);
		}
	}


}
