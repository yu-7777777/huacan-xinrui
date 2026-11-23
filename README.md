# 同频 · Streamlit 公开网站版

保留原网页的中国元素、文化回声、同物异名、台风轨迹动画和预警对照。前端作为双向 Streamlit 自定义组件运行；Python 后端承接 AI、档案检索缓存和双人卡片。浏览者不需要 GPT 或微信账号。

## 发布

1. 将本目录内容放在 GitHub 仓库根目录（不上传任何真实密钥、数据库或原站点凭证）。
2. 登录 https://share.streamlit.io/ ，选择 Deploy an app / GitHub 仓库，入口 `streamlit_app.py`，Python 3.12。
3. 在 Advanced settings / Secrets 中添加 `DEEPSEEK_API_KEY = "你的密钥"`。可选 `DEEPSEEK_MODEL = "deepseek-flash"`，模型须是账户实际可用、支持所用工具的模型。
4. 将应用可见性设为 Public，部署成功后复制平台实际返回的 `https://….streamlit.app` 地址。
5. 如邀请链接域名识别异常，Secrets 增加 `PUBLIC_APP_URL = "https://实际应用地址.streamlit.app/"`。

`.streamlit/secrets.toml`、数据库、`.env` 均不得提交。密钥只在 Python 服务端调用，不通过组件传输。

## 本地运行

Python 3.12，安装 requirements.txt 后执行 `streamlit run streamlit_app.py`。`frontend/` 已包含可部署文件；仅在从原网页重建时运行 `python prepare_frontend.py`。

## 已知边界

- Community Cloud 是外部免费托管服务，不能保证永久在线；无访问时可能休眠，访问者可唤醒。国内手机网络可达性需实测。
- GitHub 用于保存源代码，GitHub Pages 无法执行 Streamlit/Python 后端。
- 本版数据库保存在运行环境本地，重启/重建可能丢失共创草稿和检索缓存；请及时导出卡片。要保证跨重启持久化需接外部数据库。本版本不连接旧阿里云或 Sites 数据库。
- AI 调用仍消耗 DeepSeek 额度；未配置服务端密钥时如实显示未配置。模型不支持联网工具时明确报错，不伪造联网成功。
- 不能保证所有台风在所有地区都存在官方预警；已核实档案与 AI 联网补充严格分开。
