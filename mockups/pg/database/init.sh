# Create a directory inside the container if it doesn't exist
docker exec -i screencloud-postgres-db mkdir -p /docker-entrypoint-initdb.d/mockData

# Copy the SQL file into the container
docker cp mockups/pg/database/init.sql screencloud-postgres-db:/docker-entrypoint-initdb.d/mockData/init.sql

# Connect to the PostgreSQL container and run the SQL script
docker exec -it screencloud-postgres-db psql -U postgres -d screencloud-dev -a -f /docker-entrypoint-initdb.d/mockData/init.sql
