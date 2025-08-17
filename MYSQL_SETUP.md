# MySQL Setup Guide for Food Delivery Application

This guide will help you set up MySQL database for the Food Delivery Application.

## Prerequisites

- MySQL 8.0 or higher installed
- Root access to MySQL server
- Java 21+ and Maven installed

## Step 1: Install MySQL (if not already installed)

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### CentOS/RHEL:
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### macOS (using Homebrew):
```bash
brew install mysql
brew services start mysql
```

## Step 2: Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts to:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database
- Reload privilege tables

## Step 3: Create Database and User

### Option 1: Using the provided script
```bash
# Run the setup script
mysql -u root -p < setup_mysql.sql
```

### Option 2: Manual setup
```bash
# Connect to MySQL as root
mysql -u root -p

# Create database
CREATE DATABASE food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional)
CREATE USER 'fooddelivery'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON food_delivery.* TO 'fooddelivery'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

## Step 4: Update Application Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/food_delivery?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_root_password

# If using a dedicated user:
# spring.datasource.username=fooddelivery
# spring.datasource.password=your_password
```

## Step 5: Test Database Connection

```bash
# Test MySQL connection
mysql -u root -p -e "USE food_delivery; SHOW TABLES;"

# Expected output: Empty (tables will be created by the application)
```

## Step 6: Start the Application

```bash
cd backend
mvn spring-boot:run
```

The application will:
1. Connect to MySQL database
2. Create all necessary tables automatically
3. Initialize sample data
4. Start the REST API server

## Step 7: Verify Database Setup

After the application starts, check the database:

```bash
mysql -u root -p -e "USE food_delivery; SHOW TABLES;"
```

You should see tables like:
- users
- restaurants
- categories
- menu_items
- orders
- order_items
- payments

## Troubleshooting

### 1. Connection Refused
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql
```

### 2. Access Denied
```bash
# Reset MySQL root password if needed
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Database Not Found
```bash
# Create database manually
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS food_delivery;"
```

### 4. Character Set Issues
```bash
# Check and set character set
mysql -u root -p -e "ALTER DATABASE food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 5. Port Issues
```bash
# Check if MySQL is listening on port 3306
sudo netstat -tlnp | grep 3306

# Check MySQL configuration
sudo cat /etc/mysql/mysql.conf.d/mysqld.cnf | grep port
```

## Database Schema

The application will automatically create the following tables:

### Core Tables:
- **users**: User accounts and authentication
- **restaurants**: Restaurant information
- **categories**: Menu categories
- **menu_items**: Food items in restaurants
- **orders**: Order information
- **order_items**: Individual items in orders
- **payments**: Payment transaction details

### Sample Data:
The application includes sample data for testing:
- Test users (admin, regular user, restaurant owner)
- Sample restaurant with menu items
- Categories (appetizers, main courses, desserts)

## Performance Optimization

For production use, consider:

1. **Indexing**: The application creates necessary indexes automatically
2. **Connection Pool**: Configured via Spring Boot properties
3. **Query Optimization**: JPA/Hibernate handles query optimization

## Backup and Restore

### Backup:
```bash
mysqldump -u root -p food_delivery > backup.sql
```

### Restore:
```bash
mysql -u root -p food_delivery < backup.sql
```

## Security Considerations

1. **Use dedicated database user** instead of root
2. **Set strong passwords**
3. **Limit database access** to application server only
4. **Enable SSL** for production environments
5. **Regular backups**

## Next Steps

After MySQL setup:
1. Start the backend application
2. Start the frontend application
3. Run the test suite: `./test_complete_app.sh`
4. Access the application at `http://localhost:3000`

## Support

If you encounter issues:
1. Check MySQL logs: `sudo tail -f /var/log/mysql/error.log`
2. Check application logs in the console
3. Verify database connection settings
4. Ensure MySQL service is running