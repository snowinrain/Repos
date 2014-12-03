package com.realestate.common;


public abstract class GeneralBean {

//	@Autowired(required=true)
//	public LoginBean loginBean;
//
//	protected final String getViewFromNameJsp(String nameFileJSP) {
//		return "/pages/" + nameFileJSP;
//	}
//
//	public void viewReport(String FileName, HashMap<String, Object> params,
//			Collection<?> result) {
//		try {
//			InputStream jasperFile = getClass().getClassLoader()
//					.getResourceAsStream(FileName);
//			JasperReport jasperReport = (JasperReport) JRLoader
//					.loadObject(jasperFile);
//
//			JRBeanCollectionDataSource beanCollectionDataSource = new JRBeanCollectionDataSource(
//					result);
//
//			JasperPrint jasperPrint = JasperFillManager.fillReport(
//					jasperReport, params, beanCollectionDataSource);
//
//			JasperViewer.viewReport(jasperPrint, false);
//
//		} catch (JRException e) {
//			e.printStackTrace();
//		}
//	}
//
//	public boolean isRole(String role) {
//		Collection<SimpleGrantedAuthority> authorities = (Collection<SimpleGrantedAuthority>) SecurityContextHolder
//				.getContext().getAuthentication().getAuthorities();
//		for (SimpleGrantedAuthority authority : authorities) {
//			if (authority.getAuthority().equals(role)) {
//				return true;
//			}
//		}
//		return false;
//	}
//
//	public boolean isAdmin() {
//		return isRole("ROLE_ADMIN");
//	}
//
//	public boolean isAccounting() {
//		return isRole("ROLE_ACCOUNTING");
//	}
//
//	public boolean isUser() {
//		return isRole("ROLE_USER");
//	}

}
