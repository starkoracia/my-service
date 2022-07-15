cd ./final_project
call mvn clean install -DskipTests
cd ..
call docker-compose up -d