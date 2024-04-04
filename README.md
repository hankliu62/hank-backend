## HankLiu服务的后台管理系统

使用Koa2创建，所有Hank服务相关的前端都是用这个服务，统一部署在LeanCloud上面

### 本地开发

```
yarn start
```

### 项目路径
```
├─ application
    ├─ index.js
    ├─ loader.js
├─ base
    ├─ BaseClass.js
    ├─ MapClass.js
├─ common
    ├─ log4.js
├─ controller
    ├─ LazyController.js
    ├─ UserController.js
    ├─ ...
├─ extends
    ├─ helper.js
├─ extends
    ├─ helper.js
├─ middleware
    ├─ middleware.js
├─ node_modules
├─ model
    ├─ user.js
    ├─ ...
├─ routes
    ├─ lazy.js
    ├─ index.js
    ├─ ...
├─ schedule
    ├─ shcedule.js
├─ service
    ├─ LazyService.js
    ├─ UserService.js
├─ views
    ├─ ...
├─ app.js
├─ config.json
├─ config_template.json
├─ package.json
├─ utils.js
```

### 项目模块

#### Lazy 服务

懒人选择困难证用户的福音。

该服务设计的路由全部在 `/routes/lazy.js` 文件下。

根据天时，地利和人和的因素帮助选择困难证用户快速的做出最优选择，如果结果非最优，可能是你太衰了。

### 项目配置

项目完整的配置文件，请通过 `config_template.json` 查看。

### 部署

部署在LeanCloud中
