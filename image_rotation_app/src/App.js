import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rotatedImage, setRotatedImage] = useState(null);
  const [rotationDegree, setRotationDegree] = useState(0); 
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleDegreeChange = (e) => {
    setRotationDegree(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('degree', rotationDegree);  

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setRotatedImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  return (
    <div className="App">
      <h1>Dynamic Image Rotation App</h1>

      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drag & Drop an image here</p>
        <p>or</p>
        <input 
          id="fileInput" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>


      
      <div className="rotation-input">
        {rotationDegree}
        <input
          id="rotationDegree"
          type="range"
          value={rotationDegree}
          onChange={handleDegreeChange}
          min="-180"
          max="180"
        />
      </div>
      <button onClick={handleUpload} disabled={!selectedImage}>Upload & Rotate</button>

      <div className='images'>
        {selectedImage && (
          <div className='left'>
            <h2>Preview Image</h2>
            <img src={URL.createObjectURL(selectedImage)} alt="Original" width="300"  style={{ transform: `rotate(${rotationDegree}deg)` }}  />
          </div>
        )}
        {rotatedImage && (
          <div className='right'>
            <h2>Rotated Image (by {rotationDegree}°)</h2>
            <img src={rotatedImage} alt="Rotated" width="300" />
            <a href={rotatedImage} download={`rotated-image-${rotationDegree}.png`}>
               <button>Download Rotated Image</button>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
