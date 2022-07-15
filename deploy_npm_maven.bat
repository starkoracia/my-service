cd ./final_project
call mvn clean install -DskipTests
start java -jar target/final_project.jar
cd ../react_final_project
call npm install
call start npm start