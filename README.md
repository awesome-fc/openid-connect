## 功能介绍

本示例展示了如何使用函数计算（FunctionCompute，FC）生成符合 openid connect 规范的 token。通过 API 网关和 FC 的集成，您能够快速的实现弹性高可用的身份验证服务。

## 运行步骤

1. 使用函数计算的命令行工具fcli，执行 `fcli shell` 进入交互模式。执行 `sbox -t nodejs6 -d your_code dirctory` 进入沙盒环境。
2. 在代码目录下运行 `nodejs key.js`，将会在屏幕上输出生成的 public/private key，同时也会生成对应的 json 文件。
3. 请参考[相关文档](https://help.aliyun.com/document_detail/54788.html)，在函数计算（FunctionCompute）中创建相关函数。
4. 请参考[相关文档](https://help.aliyun.com/document_detail/48019.html)，在API网关的控制台上，创建授权和业务API，将公钥（public key）及其 id（下述示例中的 kid）填入授权 API 的对应配置项中。授权/业务 API 的后端实现都选择步骤3创建的函数。

  ```
  {
    kty: 'RSA',
    kid: '9rAX1L4eVPlxmtcw0re66mkk8VXEkED2Zr83Us3X_Uk',  
    e: 'AQAB',
    n: 'yKY91eRANNIozJaRbCnoKeaoJy_-QwuglxEdVK5fl5YXkWBBxvTgVmK1QT17hQzmrRRq4Lt1s1g8czWZMB9HJNfdKWb4REO9V4TiFKH6OxdkOZ503bE9ZypapBqYilk6ingb6eCfpdPhwqjtaBVXlcdZAaNDU46kPDpkpd1YkEqO8sbprsvToiX_SOagH2CNJtSrpq-Yl6YERCpCMUSWu6C45Y6mSd_PNmqA0TbelQBuDDsPQwtWE8kPmVjexcZVmSAL-tK1DJkzum5Dpt_mnQUf4zAV6fP6opN3WyCkiJi5nvwXQ2TcwvDqO5qVPSV_a3HGAD0UNo39D87mmQ5jNw' }
  ```

5. 到这一步，一个身份验证服务就搭建成功了。您可以调用授权 API，获取 response body 中的 token。并将该 token 作为业务 API 中的参数，通过 API 网关的验证，调用后端的 FC 函数。如果 token 无效，请求将会在 API 网关这一层就被拒掉。

> 注：
> 
> 1. 如果当前开发环境中已经安装了 nodejs 6+ 版本，步骤1可以跳过。
