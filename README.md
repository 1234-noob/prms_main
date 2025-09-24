Here's a **detailed step-by-step guide** for setting up, running, and testing your **Kubernetes-based microservices** with **Minikube**, **Skaffold**, **MySQL**, and **Postman**.

---

# **🚀 Microservices Setup Guide (Kubernetes + Minikube + MySQL + Workbench)**
## **📌 Prerequisites**
Before proceeding, make sure you have installed the following on your system:

✅ [Docker Desktop](https://www.docker.com/products/docker-desktop/)  
✅ [Minikube](https://minikube.sigs.k8s.io/docs/start/)  
✅ [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)  
✅ [Skaffold](https://skaffold.dev/docs/install/)  
✅ [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)  
✅ [Postman](https://www.postman.com/downloads/)  

---

## **1️⃣ Start Docker**
Since **Minikube runs inside Docker**, ensure that **Docker is running**.

1. Open **Docker Desktop**
2. Check if it is running by running:

   docker info

   If it runs successfully, Docker is active.

---

## **2️⃣ Start Minikube Cluster**
Minikube provides a lightweight Kubernetes cluster.

1. Start Minikube:

   minikube start --driver=docker

   ✅ This will start a Minikube cluster using Docker.

2. Verify Minikube is running:

   minikube status

   ✅ If everything is running, you are good to go!

---

## **3️⃣ Configure Docker to Use Minikube Daemon**
Since we are working inside Minikube, we must **tell Docker to use Minikube's environment**.

Run:
// for linux

@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i

//for windows

minikube docker-env | Invoke-Expression

✅ This **redirects** your local Docker commands to work inside Minikube.

Verify by running:

docker image ls

✅ It should now show images from **Minikube's** Docker daemon.

---

## **4️⃣ Setup Skaffold for Deployment**
Skaffold is used for continuous development.

### **🔹 Run Skaffold**
In your **project root**, run:

skaffold dev

✅ This will:
- **Build** Docker images
- **Deploy** all services to Minikube
- **Watch** for changes

---

## **5️⃣ Check Kubernetes Resources**
Once Skaffold is running, check if pods and services are deployed correctly:

### **🔹 Check Pods**

kubectl get pods

Expected Output:

NAME                                             READY   STATUS    RESTARTS   AGE
organization-management-database-584fdc4b59-xyz   1/1     Running   0          2m
organization-management-depl-97d6f69bb-xyz        1/1     Running   0          2m


### **🔹 Check Services**

kubectl get services

Expected Output:

NAME                                          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes                                    ClusterIP   10.96.0.1        <none>        443/TCP          10h
organization-management-database-service-srv  NodePort    10.106.188.97    <none>        3306:31071/TCP   2m
organization-management-srv                   NodePort    10.104.232.0     <none>        3005:31895/TCP   2m

✅ Here, **31071** is the **MySQL NodePort**, and **31895** is the **API NodePort**.

---

## **6️⃣ Connect MySQL Workbench to Minikube Database**
To **connect to MySQL running inside Minikube**, follow these steps:

### **🔹❌Method 1.(NOT RECOMMENDED)**
### **🔹 Get Minikube IP**

minikube ip

Example Output:

192.168.49.2

✅ This is the Minikube **internal IP**.

### **🔹 Start Minikube Tunnel**
Since Minikube is inside Docker, tunnel it to allow external access:

minikube tunnel


### **🔹 Connect to MySQL Workbench**
1. Open **MySQL Workbench**
2. Create a **new connection** with:
   - **Hostname**: `192.168.49.2`
   - **Port**: `31071` (from `kubectl get services`)
   - **Username**: `nilesh`
   - **Password**: `password`
   - **Database**: `organization_management`
3. Click **Test Connection**
4.  You should see "Connection Successful!"


(Note: I dont recommend Method One as it needs tunneling and so manual)

### **🔹✅Method 2(recommended)**


use 

minikube service organization-management-database-service-srv --url

this will give some thing like:

http://127.0.0.1:59406
❗  Because you are using a Docker driver on windows, the terminal needs to be open to run it.

Now 

### **🔹 Connect to MySQL Workbench**
1. Open **MySQL Workbench**
2. Create a **new connection** with:
   - **Hostname**: `127.0.0.1`
   - **Port**: `59406` (from `http://127.0.0.1:59406`)
   - **Username**: `nilesh`
   - **Password**: `password`
   - **Database**: `organization_management`
3. Click **Test Connection**
4.  You should see "Connection Successful!"
---

## **7️⃣ Test APIs in Postman**
Once **everything is running**, test the APIs.

### **🔹❌Method 1.(NOT RECOMMENDED)**
### **🔹 Get API URL**
Find the **API NodePort**:

kubectl get services | findstr "organization-management-srv"

Example Output:

organization-management-srv   NodePort   10.104.232.0   <none>   3005:31895/TCP   2m

✅ Here, **31895** is the API port.

### **🔹 Test API in Postman**
1. Open **Postman**
2. Test the **GET Organizations API**:
   - **Method**: `GET`
   - **URL**: `http://192.168.49.2:31895/api/organizations`
   - Click **Send**
   - ✅ Should return `[]` (empty array if no data)

3. **Test Create Organization API**:
   - **Method**: `POST`
   - **URL**: `http://192.168.49.2:31895/api/organizations`
   - **Body (JSON)**:
     ```json
     {
       "name": "Tech Corp",
       "address": "Silicon Valley, CA"
     }
     ```
   - Click **Send**
   - ✅ Should return:
     ```json
     {
       "id": 1,
       "name": "Tech Corp",
       "address": "Silicon Valley, CA",
       "created_at": "2025-02-20T10:00:00.000Z",
       "updated_at": "2025-02-20T10:00:00.000Z"
     }
     ```

4. **Test Fetch Organizations API Again**:
   - **Method**: `GET`
   - **URL**: `http://192.168.49.2:31895/api/organizations`
   - Click **Send**
   - ✅ Should return the organization you just created.

---


(This has a limitation as we need to tunnel manually using minikube tunnel to access extrenally)

But 
### **🔹✅Method 2.(RECOMMENDED)**


minikube service organization-management-srv --url

will return http://127.0.0.1:63679

we can use that directly like GET http://127.0.0.1:63679/api/organizations in postman to test and same for other apis


## **8️⃣ Stop Minikube and Cleanup**
To **stop everything**:

minikube stop

To **delete everything**:

minikube delete

This **removes all resources and clears Minikube**.

---

## **🎯 Summary of Steps**
| Step | Command | Description |
|------|---------|-------------|
| **1** | `docker info` | Ensure Docker is running |
| **2** | `minikube start --driver=docker` | Start Minikube cluster |
| **3** | `@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i`| LINUX: Use Minikube's Docker daemon |
| **3** | `minikube docker-env &#124; Invoke-Expression`| WINDOWS: Use Minikube's Docker daemon |
| **4** | `skaffold dev` | Deploy services |
| **5** | `kubectl get pods` | Check if services are running |
| **6** | `kubectl get services` | Get MySQL & API NodePorts |
| **7** | `minikube ip` | Get Minikube IP |
| **8** | `minikube tunnel` | Tunnel external access |
| **9** | **Connect MySQL Workbench** | Use Minikube IP + MySQL NodePort |
| **10** | **Test APIs in Postman** | Use Minikube IP + API NodePort |
| **11** | `minikube stop` | Stop everything |

---

## 🎉 **Done! Your Microservices are Fully Running on Kubernetes.**
Now you can **develop, test, and debug** inside **Minikube**. 🚀


### **🔹✅Migration**

npx typeorm migration:generate -n InitialMigration
### ** **

npx typeorm migration:run


### **🔹✅When Schema Changes**


npx typeorm migration:generate -n AddNewFields
### ** **

npx typeorm migration:run

### **🔹✅To Check Logs**

kubectl logs -f deployment/organization-management-depl