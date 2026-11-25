"""Same Tongpin interface, hosted by Streamlit with a Python API bridge."""
from pathlib import Path
import os
import streamlit as st
import streamlit.components.v1 as components
from backend import Backend

ROOT = Path(__file__).parent
st.set_page_config(page_title="同频 · 山海相望，风雨共济", page_icon="🌿", layout="wide", initial_sidebar_state="collapsed")
st.markdown('''<style>
[data-testid="stHeader"]{display:none}
.block-container{padding:0!important;max-width:100%!important}
[data-testid="stMainBlockContainer"]{padding:0!important}
iframe{border:0;display:block;width:100%}
</style>''', unsafe_allow_html=True)

@st.cache_resource
def backend(source_version):
    return Backend(ROOT / "frontend", ROOT / "data" / "tongpin.sqlite")

def setting(name, default=""):
    try:
        return st.secrets.get(name, os.environ.get(name, default))
    except (FileNotFoundError, st.errors.StreamlitSecretNotFoundError):
        return os.environ.get(name, default)

view = components.declare_component("tongpin_public_20261125_10", path=str(ROOT / "frontend"))
if "rpc_responses" not in st.session_state:
    st.session_state.rpc_responses = {}
responses = st.session_state.rpc_responses
headers = st.context.headers
host = headers.get("X-Forwarded-Host", headers.get("Host", "localhost:8501"))
public_url = setting("PUBLIC_APP_URL") or ("http" if host.startswith(("localhost", "127.0.0.1")) else "https") + "://" + host + "/"
request = view(responses=responses, invite=st.query_params.get("invite", ""), public_url=public_url, key="tongpin-ui", default=None)
if isinstance(request, dict) and isinstance(request.get("id"), str) and len(request["id"]) < 100 and request["id"] not in responses:
    try:
        response = backend((ROOT / "backend.py").stat().st_mtime_ns).handle(request, setting("DEEPSEEK_API_KEY"), setting("DEEPSEEK_MODEL", "deepseek-flash"))
    except Exception:
        response = {"status":500,"body":{"error":"服务暂不可用，请稍后重试"}}
    responses[request["id"]] = response
    while len(responses) > 64:
        responses.pop(next(iter(responses)))
    st.rerun()
