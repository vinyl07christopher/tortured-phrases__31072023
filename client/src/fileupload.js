import React, { useState } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload, faFile } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import FadeLoader from "react-spinners/FadeLoader";
import { PDFDownloadLink, Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import Html from "react-pdf-html";

import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 6,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
  },
  text: {
    marginBottom: 10,
    fontSize: 6,
  },
});
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [highlightedText, setHighlightedText] = useState("");
  const [wordCounts, setWordCounts] = useState({});
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [outputPDFFfileName__, setOutputPDFFfileName__] = useState("");
  const [google_title, setGoogle_title] = useState("");

  const [title, setTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    if (!file) {
      setShowLoadingScreen(false);
      return alert("Please choose file to upload !!");
    }

    if (!title) {
      setShowLoadingScreen(false);
      return alert("Please enter title");
    }
    try {
      setShowLoadingScreen(true);
      const response = await axios.post(process.env.REACT_APP_API_URL + "/api/upload", formData, title);

      setShowLoadingScreen(false);
      const {
        highlightedText: responseHighlightedText,
        wordCounts: responseWordCounts,
        google_title: searchGoogleForTitle,
        filename,
      } = response.data;

      let outputPDFFfileName = filename;
      const fileNameParts = outputPDFFfileName.split(".");
      fileNameParts.pop();
      setOutputPDFFfileName__(`${fileNameParts.join(".")}_phrases_found.pdf`);

      setHighlightedText(responseHighlightedText);
      setWordCounts(responseWordCounts);
    } catch (error) {
      console.error("Error uploading file:", error);
      setShowLoadingScreen(false);
      alert("This file not support");
    }
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Html style={{ fontSize: "12px", fontFamily: "Times New Roman" }}>{highlightedText}</Html>
        </View>
      </Page>
    </Document>
  );

  const handleClearDocument = () => {
    setShowLoadingScreen(true);

    setHighlightedText("");
    setWordCounts("");
    setFile(null);
    setFileName("");
    setShowLoadingScreen(false);
  };

  const loadingScreen = () => {
    return (
      <div
        className="d-flex display-5 justify-content-center align-items-center"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: "10",
          backgroundColor: "#0006",
        }}
      >
        <div className="text-light">
          {/* Loading */}
          {/* <Spinner className="ms-3" animation="border" role="status"> */}
          <FadeLoader color="darkorange" />

          {/* </Spinner> */}
        </div>
      </div>
    );
  };

  const colors = [
    "#FF0000",
    "#0000FF",
    "#FF00FF",
    "#808000",
    "#FFA500",
    "#000000",
    "#808080",
    "#3CB371",
    "#57E964",
    "#FDBD01",
    "#D4A017",
    "#513B1C",
    "#EB5406",
    "#F62217",
    "#810541",
    "#F8B88B",
    "#FF00FF",
    "#BA55D3",
    "#800080",
  ];
  const wordMatchColor = {};
  let nextMatchColor = 0;

  const textStyle = {
    // textAlign: "center",
    color: "#000c",
    fontSize: "50px",
    fontFamily: "'Exo', sans-serif",
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleSubmit1}>
      <div>
        {showLoadingScreen && loadingScreen()}

        <div className="animationContainer">
          <div className="app">
            <div className="container display-4  pt-5 pb-3" style={textStyle}>
              <h4 class="d-inline-flex p-2 bd-highlight border border text-dark display-5 font-monospace  rounded p-2">TP Detector</h4>
              <button
                className="btn btn border border-dark bg-white position-absolute"
                style={{
                  position: "fixed",
                  left: "80%",
                  transform: "translateX(-20%)",
                }}
                onClick={handleLogout}
              >
                Logout
              </button>{" "}
              <br />
              <button
                className="btn btn border border-danger bg-white position-absolute"
                style={{
                  position: "fixed",
                  left: "10%",
                  transform: "translateX(-20%)",
                }}
                onClick={handleDashboard}
              >
                Dashboard
              </button>
            </div>

            <br />

            <div className="row pt-5 justify-content-center" style={{ transition: "all .3s" }}>
              <div className="mb-5  col-lg-4">
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon3">Enter Title</InputGroup.Text>
                  <Form.Control
                    placeholder="Enter titlename"
                    aria-label="Titlename"
                    aria-describedby="basic-addon1"
                    value={title}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                {showAlert && <div className="alert alert-danger">Please fill the title field</div>}

                <div class="parent me-3">
                  <div className=" file-upload mx-auto">
                    <div>
                      <h3>
                        <CSSTransition in={true} appear={true} timeout={500} classNames="animation">
                          <FontAwesomeIcon icon={faFile} className="file-icon" />
                        </CSSTransition>
                        &nbsp; Choose Browse File from Device
                      </h3>
                      <input type="file" accept=".doc,.docx" onChange={handleFileUpload} required />
                    </div>
                  </div>{" "}
                  {fileName && <div class="small my-1">{fileName}</div>}
                  <div class="small my-1 text-danger">Max Upload Size: 12 MB</div>
                  &nbsp; &nbsp;
                  <button onClick={handleSubmit} type="submit" className="upload-button btn-block w-100">
                    <FontAwesomeIcon icon={faUpload} />
                    Upload
                  </button>
                  <div style={{ cursor: "pointer" }} onClick={handleClearDocument} className="text-primary p-0 bg-transparent mt-4 text-end">
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Reset
                  </div>
                </div>
              </div>

              {highlightedText && (
                <div className=" mb-5 col-lg-6 parent m-0">
                  <div className="mx-auto ">
                    {highlightedText && Object.keys(wordCounts).length === 0 && (
                      <div>
                        <h1>No matched torture phrases found.</h1>
                      </div>
                    )}

                    {Object.keys(wordCounts).length > 0 && (
                      <div>
                        <h1>Torture Phrases Found:</h1>
                        <ul>
                          {Object.entries(wordCounts).map(([word, count]) => {
                            if (!wordMatchColor[word]) {
                              wordMatchColor[word] = colors[nextMatchColor];
                              nextMatchColor++;
                              if (nextMatchColor === colors.length) {
                                nextMatchColor = 0;
                              }
                            }
                            return (
                              <li style={{ color: wordMatchColor[word] }} key={word}>
                                {word}: {count}
                              </li>
                            );
                          })}
                        </ul>
                        <br />
                        <h3>Google Title check:</h3>
                        {google_title}
                      </div>
                    )}

                    {highlightedText && (
                      <div>
                        <PDFDownloadLink className="btn btn-danger" document={<MyDocument />} fileName={outputPDFFfileName__}>
                          {({ loading }) => (loading ? "Loading document..." : "Download as PDF")}
                        </PDFDownloadLink>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FileUpload;

// import React, { useState } from 'react';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [downloadLink, setDownloadLink] = useState('');

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setDownloadLink(data.downloadLink);
//       } else {
//         alert('Error occurred during file processing.');
//       }
//     } catch (error) {
//       alert('Error occurred during file upload.');
//     }
//   };

//   return (
//     <div>
//       <h1>Document Highlighter</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       {downloadLink && (
//         <p>
//           <a href={downloadLink} download>
//             Download Highlighted PDF
//           </a>
//         </p>
//       )}
//     </div>
//   );
// };

// export default FileUpload;
