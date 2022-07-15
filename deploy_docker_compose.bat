cd ./final_project
call mvn clean install -DskipTests
cd ../react_final_project
call npm install
cd ..
call docker-compose up -d