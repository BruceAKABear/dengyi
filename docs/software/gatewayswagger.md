<div>
    <img :src="$withBase('/gatewayswagger/swagger.jpg')" >
</div>

::: tip
开发中使用swagger这个框架可以方便快捷的生成接口文档，这其实省去了以前用Word写接口文档的大量时间。单体应用中这似乎是非常好的解决访问，但是近年来微服务越来越多，但是却很少有人将文档提到网关这层统一访问，那这次就来讲讲如何在网关中统一管理API文档。
:::

## 1. 网关选型

自从eureka停更以后，先如今只有性能更强的spring家族的[spring-cloud-gateway](https://spring.io/projects/spring-cloud-gateway)可以选择了。用了[spring-cloud-gateway](https://spring.io/projects/spring-cloud-gateway)就要注意一点本质区别，那就是spring-cloud-gateway使用的web-flux技术来开发的类似于Android中的rxjava。很多人搭建网关项目不能启动的根本原因就是因为webflux，他和我们以前servlet是冲突的，所以千万不要在网关中引入相关的依赖。以下我将基于[spring-cloud-gateway](https://spring.io/projects/spring-cloud-gateway)网关进行配置。

## 2. swagger原理解析

其实，swagger是一个非常死的框架，项目启动扫描注解生成文档数据，然后将数据渲染到UI页面中。我们在项目通常依赖两个包：

```
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
        </dependency>

        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
        </dependency>

```
springfox-swagger-ui仅仅是一个页面，我们打开jar包就会发现这个项目中只有前端静态页面，**那么就是说，引入或者自己写页面全看自己的心情**，很多大公司的api文档都是自己写的页面看起来就和默认页面不一样，但是数据来源还是来自于springfox-swagger2接口中的数据。
<div>
    <img :src="$withBase('/gatewayswagger/swagger-ui.jpg')" >
</div>

当我们去查swagger的数据源来自哪里你就会发现这样的一个接口，这个接口是获取所有数据的接口。

```
/v2/api-docs

```
<div>
    <img :src="$withBase('/gatewayswagger/swagger-api.jpg')" >
</div>

那么，我们在网关中统一部署swagger文档的方法就有了。

## 3. 网关中部署api文档

## 3.1 实现SwaggerResourcesProvider接口，重写提供资源接口地址

因为是微服务项目，各个服务的api接口都是分散的，那我们必须在网关项目中将所有微服务的文档接口地址统一配置好。只需要实现SwaggerResourcesProvider接口重写get()方法即可。

逻辑为：

1. 取出所有的网关中定义的routes中定义的route集合：

```xml

spring:
  application:
    name: MYHOME-GATEWAY
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
      routes:
        - id: MYHOME-FRONTEND
          uri: lb://MYHOME-FRONTEND
          metadata:
            visiableName: 用户前台
          predicates:
            - Path=/frontend/**
        - id: MYHOME-BACKEND
          uri: lb://MYHOME-BACKEND
          metadata:
            visiableName: 管理后台
          predicates:
            - Path=/backend/**
```

2. 过滤有效的路径集合：
3. 设置包含swagger需要基础信息的响应集合
> 接口为：/swagger-resources ,
>当集合中有多个文档基本信息时，也就是多个接口组。那么swagger将会在右上角以下拉菜单的形式供选择。

<div>
    <img :src="$withBase('/gatewayswagger/对比.gif')" >
</div>

代码如下：

```java
@Component
public class ResourceProvider implements SwaggerResourcesProvider {
    // swagger2.0版本的接口路径
    public static final String API_URI = "/v2/api-docs";
    @Autowired
    private RouteLocator routeLocator;
    @Autowired
    private GatewayProperties gatewayProperties;


    @Override
    public List<SwaggerResource> get() {
        List<SwaggerResource> resources = new ArrayList<>();
        List<String> routes = new ArrayList<>();
        //取出gateway的route
        routeLocator.getRoutes().subscribe(route -> routes.add(route.getId()));
        //结合配置的route-路径(Path)，和route过滤，只获取有效的route节点
        gatewayProperties
                .getRoutes()
                .stream()
                .filter(routeDefinition -> routes.contains(routeDefinition.getId()))
                .forEach(routeDefinition -> routeDefinition
                        .getPredicates()
                        .stream()
                        .filter(predicateDefinition -> ("Path").equalsIgnoreCase(predicateDefinition.getName()))
                        .forEach(predicateDefinition -> resources.add(
                                swaggerResource((String) routeDefinition.getMetadata().get("visiableName"), predicateDefinition.getArgs().get(NameUtils.GENERATED_NAME_PREFIX + "0").replace("/**", API_URI))
                                )
                        )
                );
        return resources;
    }

    private SwaggerResource swaggerResource(String name, String location) {
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName(name);
        swaggerResource.setLocation(location);
        swaggerResource.setSwaggerVersion("2.0");
        return swaggerResource;
    }
}

```

## 3.2 定义一个controller给页面，让页面能请求到相应的数据

前面已经折腾了几个接口，这一步就是在gateway工程中对外提供接口，让前端页面能请求到数据。接口个数、怎么命名的不要自己猜，打开控制台看swagger请求了几个就写几个。需要注意一点，因为gateway是webflux写的，所有要么以Mono返回要么以ResponseEntity返回。**这里的ResponseEntity是框架的，千万不要和自己自定义的搞混，包名为：org.springframework.http.ResponseEntity**

代码如下：

```java

@RestController
@RequestMapping("/swagger-resources")
public class SwaggerController {
    @Autowired
    private ResourceProvider swaggerResources;

    @RequestMapping(value = "/configuration/security")
    public ResponseEntity<SecurityConfiguration> securityConfiguration() {
        return new ResponseEntity<>(SecurityConfigurationBuilder.builder().build(), HttpStatus.OK);
    }

    @RequestMapping(value = "/configuration/ui")
    public ResponseEntity<UiConfiguration> uiConfiguration() {
        return new ResponseEntity<>(UiConfigurationBuilder.builder().build(), HttpStatus.OK);
    }

    @RequestMapping
    public ResponseEntity<List<SwaggerResource>> swaggerResources() {
        return new ResponseEntity<>(swaggerResources.get(), HttpStatus.OK);
    }
}

```

## 3.3 让gateway增加对静态资源的支持

我们平时使用网关基本上是做请求转发之类的，为了能够在网关中能访问到swagger的静态页面需要做一下配置。

:::tip 提示
swagger静态页面直接从swagger-ui这个jar包下copy出来就行了，以前jar包中是什么格式就保持什么格式，因为swagger页面的js里面很多地方写死了，目录层级不对可能找不到资源，当然你可以自己改它的JS
:::

代码：
```java
/**
 * 全局配置
 *
 * @author dengyi (email:dengyi@dengyi.pro)
 * @date 2021-08-10
 */
@Configuration
public class GatewayConfig {

    /**
     * webflux 静态资源配置
     *
     * @return serverResponse
     */
    @Bean
    RouterFunction<ServerResponse> staticResourceRouter() {
        return RouterFunctions.resources("/**", new ClassPathResource("/"));
    }
}


```

## 3.4 修改页面默认页面(如果需要)

默认情况下swagger-ui包下只有一个**swagger-ui.html**，和webjar.spring-swagger-ui文件夹下的一堆js和css。

1. 如果你不做任何修改，将swagger-ui.html这个H5页面和webjar.spring-swagger-ui文件夹复制到网关工程的resources目录下，启动项目就可以了，访问静态页面嘛就是ip+端口+静态资源地址就可以了。也就是说默认情况下网关中整合的swagger-ui地址为：**网关ip:网关port/swagger-ui.html**

2. 如果你想在页面上更改一些页面样式或者页面的文字，比如改成中文之类的。那其实和改普通的前端页面一样，这就不过多赘述了。

<div>
    <img :src="$withBase('/gatewayswagger/customswagger.jpg')" >
</div>
