import React from 'react';
import { StreamlitComponentBase, withStreamlitConnection } from 'streamlit-component-lib';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


interface PDFViewerWrapperProps {
  fileUrl: string;
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({ fileUrl }) => {
  const layout=defaultLayoutPlugin();
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
      <div style={{border: '1px solid rgba(0, 0, 0, 0.3)',height: '970px'}}>
          {fileUrl && <Viewer fileUrl={fileUrl} plugins={[layout]}/>}
      </div>
    </Worker>
  );
};


interface State {
  fileUrl: string;
  base64_string: string;
}

class PDFViewer extends StreamlitComponentBase<State> {

  public state: State = {
    fileUrl: '',
    base64_string:'',
  };

  componentDidMount(): void {
    super.componentDidMount();
    //console.log("Component mounted");
    const newBase64 = this.props.args["base64_string"] ?? '';
    if (newBase64 !== this.state.base64_string) {
      this.loadPDF(newBase64);
    }

  }

  componentDidUpdate(): void {
    // Accessing the current props directly
    //console.log("Component updated");
    const newBase64 = this.props.args["base64_string"] ?? '';
    if (newBase64 !== this.state.base64_string) {
      this.loadPDF(newBase64);
    }
  }

  private logString(mystring:string):void{
    if (mystring.length > 100) {
      console.log(mystring.substring(0, 100));
    } else {
      console.log(mystring);
    }
  }


  private base64toBlob(data: string):Blob {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substring('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  }

  private loadPDF(base64String: string):void {
    //console.log("In loadPDF")
    const pdfBlob = this.base64toBlob(base64String);
    const fileUrl = URL.createObjectURL(pdfBlob);
    this.setState({ fileUrl:fileUrl, base64_string:base64String});
  } 

  public render(): React.ReactNode {

    const fileUrl = this.state.fileUrl;
    console.log(fileUrl);

    return (
      <PDFViewerWrapper fileUrl={fileUrl}/>
    );
  }
}

export default withStreamlitConnection(PDFViewer);