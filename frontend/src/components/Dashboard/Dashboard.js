import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await axios.get('/api/files', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setFiles(data);
    };
    fetchFiles();
  }, [userInfo]);

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/files/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        },
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFileHandler = async (filename) => {
    try {
      await axios.delete(`/api/files/${filename}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={uploadFileHandler}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            {file.originalname}
            <button onClick={() => deleteFileHandler(file.filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
