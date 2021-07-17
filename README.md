# MIDDLEWARE USER ACCESS POINT

## DESCRIPTION
Service auth untuk middleware role akses menus user.
service ini di gunakan untuk middleware (AUTH) akses menu (role permission). setiap user / client memiliki role akses Endpoint. <br>

Tujuan service ini untuk managament user role agar tidak semua user dengan role tertentu bisa akses semua menu.<br>

Default Role terdari 3 level <br>
1. Super Admin
2. Admin 
3. CS
<br>

Bisa di tambahkan dengan role baru seperti CLIENT / Member
    tergantung kebutuhan di masing-masing developper.<br>

## Default services
1. Register user
2. Login user
3. Forgot password
4. Reset password
5. Create Endpoint access / menu
6. Create Role Menu access
7. Insert default acces user menu
8. Adding menu access
9. Get list menu access user with id user (JWT)
10. User access permission

## INSTALLING, MIGGRATION AND CONFIG DB

> Sebelum install package terlebih dahulu setting konfigurasi database pada file config/config.json dan config file .env_emp menjadi .env serta isi sesuai kebutuhan.


```
npm install
npx sequelize-cli db:migrate
npm start
```

### Menambahkan model
```
npx sequelize-cli model:generate --name table_name --attributes fildname1:string,fildname2:integer
```

sebelum menggnakan fitur register user silahkan insert file <b>users.json</b> ke table <b>MASTER_USER</b> untuk menyediakan roles awal
<br>

port yang di gunakan 3001 <br>
base url <b>http://localhost:3001/api</b>
<br>
<br>

# Example services

ROLES ID | ROLES NAME 
-------- | --- 
1 | SUPER ADMIN
2 | ADMIN
3 | CS
#### Base url **localhost:3001/api**

NO | NAME | Endpoint | METHOD | HEADER TOKEN | BODY-JSON | ROLE 
-- | ---- | -------- | ------ | ------------ | --------- | ----
1 | REGISTER user | /register | POST | FALSE | FASLE | ALL
2 | LOGIN | /login | POST | FALSE | TRUE | ALL 
3 | FORGOT PASSWORD | /ForgotPassword | POST | FALSE | TRUE | ALL 
4 | RESET PASSWORD | /ResetPassword | POST | FALSE | TRUE | ALL 
5 | REGISTER MENU/ENDPOINT | /endpoint/register | POST | TRUE | TRUE | 1, 2
6 | UPDATE ENDPOINT | /endpoint | PUT | TRUE | TRUE | 1, 2
7 | DELETE (STATUS) ENDPOINT | /endpoint/:id | POST | TRUE | FALSE | 1, 2
8 | ACTIVITED ENDPOINT | /endpoint/:id | POST | TRUE | TRUE | 1, 2
9 | LIST ENDPOINT USER (TOKEN) | /endpoint | GET | TRUE | FALES | ALL USER
10 | GET LIST MENU USER (EMAIL) | /endpoint/user | POST | TRUE | TRUE | 1, 2

<br>


# REGISTRASI USER 
Endpoint :localhost:3001/api/register <br>
Method  :POST<br>
request-body-Json
```JSON
{
    "email":"admin1@m.com",
    "username":"admin1",
    "password":"admin1",
    "password_confirmation":"admin1",
    "role":1
}
```
# LOGIN USER 
Endpoint :http://localhost:3001/api/login <br>
Method  :POST<br>
request-body-Json
```JSON
{
    "email":"admin1@m.com",
    "password":"admin1"
}
```
<br>

# FORGOT PASSWORD
**Service Request forgot password** <br>
Endpoint :localhost:3001/api/ForgotPassword <br>
Method  :POST<br>
Header :
```JSON
Content-Type: application/json
```
request-body-Json
```JSON
{
    "email":"user@xxx.in"
}
```

# RESET PASSWORD
**Service update password user** <br>
Endpoint :localhost:3001/api/ResettPassword <br>
Method  :POST<br>
Header :
```JSON
Content-Type: application/json
```
request-body-Json
```JSON
{
    "token":"Your_token",
    "email":"email@gmail.com",
    "password":"new_password",
    "password_confirmation":"new_password"
}
```

# REGISTER MENU/ENDPOINT (SUPER ADMIN ONLY)
<p>service untuk mendaftarkan Menu/enpoint dari masing-masing microservice. Body json dengan array object
</p>

### Example
Endpoint :localhost:3001/api/endpoint/register <br>
Method  :POST<br>
Header :
```JSON
Authorization:Bearer TOKENXXX
Content-Type: application/json
```
request-body-Json
```JSON
[
    {
        "server":"http://server-a.com",
        "service_name":"service-kirim",
        "method": "GET",
        "path": [
            "master",
            "ekspedisi"
        ],
        "description":"GET LIST EKSPEDISI SERVICE KIRIM",
        "docs":"http://docs.klink.test"
    }, 
    ...
]
```

# UPDATE ENDPOINT (SUPER ADMIN / ADMIN)
UPDATE ENDPOINT

### Example
Endpoint :localhost:3001/api/endpoint <br>
Method  :POST<br>
Header :
```JSON
Authorization:Bearer TOKENXXX
Content-Type: application/json
```
request-body-Json
```JSON
{
    "oldData":{
        "server":"https://service-bonus.prod",
        "service_name":"service-bonus",
        "method": "GET",
        "path": [
            "bonus",
            "member",
            "ekspedisi"
        ]
    },
    "newData":{
        "server":"https://service-bonus.prod",
        "service_name":"service-bonus",
        "method": "GET",
        "path": [
            "bonus",
            "member"
        ],
        "description":"GET LIST EKSPEDISI SERVICE KIRIM",
        "docs":"http://docs.bonus.test"
    }
}
```

# GET LIST ENDPOIN SELF
### Example
Endpoint :localhost:3001/api/endpoint <br>
Method  :POST<br>
Header :
```JSON
Authorization:Bearer TOKENXXX
Content-Type: application/json
```