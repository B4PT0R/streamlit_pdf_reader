# streamlit-pdf-reader

Streamlit pdf reader component

## Installation instructions

```sh
pip install streamlit-pdf-reader
```

## Usage instructions

```python
pdf_reader(source)
```

`source` can be either a local pdf file, a pdf file url, or a BytesIO 

## Example
```python
import streamlit as st
from streamlit_pdf_reader import pdf_reader

source1='./test.pdf'
pdf_reader(source1)

source2="https://www-fourier.ujf-grenoble.fr/~faure/enseignement/relativite/cours.pdf"
pdf_reader(source2)

source3=st.file_uploader("Choose a pdf file:")
if source3:
    pdf_reader(source3)

st.button("Rerun")
```