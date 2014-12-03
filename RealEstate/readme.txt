**** IMPORTANT ****
1) Before start webapp, MUST to do:
- Upload folder MUST BE EXISTED before.(/upload/news, /upload/avatar, /upload/article)
- Navigate to META-INF/context.xml
- Change "aliases" value to right Upload folder.

2) To publish website:
- Change port Tomcat to 80
- Set machine to STAIC IP (ex: 192.168.1.50)
- Login to 192.168.1.1 -> Port Forwarding -> Forward port 80 to 192.168.1.50 (make sure status is ON)
- Access to http://canyouseeme.org/ to check port forwarding
- http://www.dnsexit.com(snowinrain/loveforever) -> Use DNS of this website

3) Overwrite ContextRoot
- Right-click Project
- Select Properties
- Search "Web Project Setting"
- Set "Context Root" to "/"
- In server.xml of tomcat, change ContextPath to "/"

==> Webapp will have URL: <localhost> or <domain_name>
