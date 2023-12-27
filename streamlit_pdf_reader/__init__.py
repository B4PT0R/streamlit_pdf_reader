import os
import base64
import streamlit.components.v1 as components
import requests
from pathlib import Path
from io import BytesIO

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component("streamlit_pdf_reader",url="http://localhost:3001")
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("streamlit_pdf_reader", path=build_dir)

def load_pdf(source):
    """Load a PDF from various sources and return as a Base64 encoded string."""
    
    if isinstance(source, str) and source.startswith('http'):
        response = requests.get(source)
        response.raise_for_status()
        pdf_bytes = response.content
    elif isinstance(source, str) and Path(source).is_file():
        with open(source, 'rb') as file:
            pdf_bytes = file.read()
    elif isinstance(source, BytesIO):
        pdf_bytes = source.getvalue()
    else:
        raise ValueError("Invalid source type for PDF.")

    # Encode to Base64 and prepend MIME type
    base64_pdf = base64.b64encode(pdf_bytes).decode()
    full_base64_string = f'data:application/pdf;base64,{base64_pdf}'

    return full_base64_string

def pdf_reader(source, key=None):
    """Streamlit component to display a PDF from various sources."""
    
    # Encode the source to Base64
    base64_string = load_pdf(source)

    # Call the frontend component
    return _component_func(base64_string=base64_string, key=key)


if not _RELEASE:
    import streamlit as st

    source1='./test.pdf'
    pdf_reader(source1)

    source2="https://www-fourier.ujf-grenoble.fr/~faure/enseignement/relativite/cours.pdf"
    pdf_reader(source2)

    source3=st.file_uploader("Choose a pdf file:")
    if source3:
        pdf_reader(source3)

    st.button("Rerun")
